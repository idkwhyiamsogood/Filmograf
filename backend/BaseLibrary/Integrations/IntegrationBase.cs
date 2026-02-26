using Filmograf.BaseLibrary.Integrations.Payload;
using Filmograf.BaseLibrary.Models.HttpExceptions;
using Filmograf.BaseLibrary.Models.IntegrationExceptions;
using Filmograf.BaseLibrary.Util;
using Newtonsoft.Json;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace Filmograf.BaseLibrary.Integrations;

public abstract class IntegrationBase<ReqPayload, ResPayload> : IntegrationBase<ReqPayload, ResPayload, IntegrationContextBase>
    where ReqPayload : IntegrationRequestPayloadBase
    where ResPayload : IntegrationResponsePayloadBase
{
    public IntegrationBase(IChannel channel, string actionName, string routingKey) : 
        base(channel, actionName, routingKey) { }
}

public abstract class IntegrationBase<ReqPayload, ResPayload, TContext> : IIntegrationHandler
    where ReqPayload : IntegrationRequestPayloadBase 
    where ResPayload : IntegrationResponsePayloadBase
    where TContext : IntegrationContextBase
{
    protected IChannel _channel;
    protected string _actionName;
    protected string _routingKey;

    public IntegrationBase(IChannel channel, string actionName, string routingKey)
    {
        _channel = channel;
        _actionName = actionName;
        _routingKey = routingKey;
    }

    public virtual async Task ProcessMessageAsync(object sender, BasicDeliverEventArgs ea, IChannel channel, object context)
    {
        try
        {
            // сперва десериализуем сам запрос
            var request = SerializationUtil.DeserializeFromBytes<IntegrationRequest>(ea.Body.ToArray());
            if (request == null) return;

            // если по какой-то причине action в IntegrationRequest не совпадает с ожидаемым - дропаем исключение
            if (!string.Equals(_actionName, request.Action))
                throw new IncorrectActionIntegrationException(_actionName, request.Action);

            // далее десериализуем payload в запросе
            var payload = request.Payload != null ? JsonConvert.DeserializeObject<ReqPayload>(request.Payload) : null;

            // обрабатываем запрос
            await ProcessRequestAsync(request, payload, context as TContext ?? throw new Exception());
        }
        catch (HttpException htex)
        {
            Console.WriteLine($"Http Error: {htex.StackTrace}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error: {ex.StackTrace}");
        }
        finally
        {
            await _channel.BasicAckAsync(ea.DeliveryTag, false);
        }
    }

    protected virtual async Task ProcessRequestAsync(IntegrationRequest request, ReqPayload? payload, TContext context)
    {
        try
        {
            // обрабатываем запрос, получаем и сериализуем payload
            var responsePayload = await ProcessingAsync(request, payload, context);
            var responseSerializePayload = SerializationUtil.Serialize<ResPayload>(responsePayload);

            // формируем ответ
            var response = new IntegrationResponse
            {
                RequestId = request.RequestId,
                Action = GetResponseActionName(),
                RequestAction = request.Action,
                Payload = responseSerializePayload
            };

            // готовим ответ к отправке: сериализуем в байты 
            var responseBytes = SerializationUtil.SerializeToBytes<IntegrationResponse>(response);

            // публикуем ответ
            await _channel.BasicPublishAsync(
                exchange: "",
                routingKey: _routingKey,
                body: responseBytes
            );
        }
        catch (HttpException htex)
        {
            await ProcessingError(request, new { ErrorCode = htex.Code }, htex.Message);
        }
        catch (IntegrationException iex)
        {
            await ProcessingError(request, iex.Payload, iex.Message);
        }
        catch (Exception ex)
        {
            await ProcessingError(request, new { ErrorCode = "CommonException" }, ex.Message);
        }
    }

    private async Task ProcessingError(IntegrationRequest request, object? errorPayload, string errorMessage)
    {
        // формируем ответ
        var response = new IntegrationResponse
        {
            RequestId = request.RequestId,
            Action = GetResponseActionName(),
            RequestAction = request.Action,
            Payload = SerializationUtil.Serialize(errorPayload),
            Success = false,
            ErrorMessage = errorMessage
        };
            
        // готовим ответ к отправке: сериализуем в байты 
        var responseBytes = SerializationUtil.SerializeToBytes<IntegrationResponse>(response);
        
        // публикуем ответ
        await _channel.BasicPublishAsync(
            exchange: "",
            routingKey: _routingKey,
            body: responseBytes
        );
    }

    public virtual string GetActionName()
    {
        return _actionName;
    }
    
    public virtual string GetResponseActionName()
    {
        return $"{_actionName}_response";
    }

    protected abstract Task<ResPayload> ProcessingAsync(IntegrationRequest request, ReqPayload? payload, TContext context);

    public Type GetIntegrationContextType()
    {
        return typeof(TContext);
    }
}