using Newtonsoft.Json;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using Filmograf.BaseLibrary.Integrations.Payload;
using Filmograf.BaseLibrary.Models.HttpExceptions;
using Filmograf.BaseLibrary.Models.IntegrationExceptions;
using Filmograf.BaseLibrary.Util;

namespace Filmograf.BaseLibrary.Integrations;

public abstract class NoAskIntegrationBase<ReqPayload> : NoAskIntegrationBase<ReqPayload, IntegrationContextBase>
    where ReqPayload : IntegrationRequestPayloadBase
{
    public NoAskIntegrationBase(IChannel channel, string actionName) : 
        base(channel, actionName) { }
}

public abstract class NoAskIntegrationBase<ReqPayload, TContext> : IIntegrationHandler
    where ReqPayload : IntegrationRequestPayloadBase 
    where TContext : IntegrationContextBase
{
    protected IChannel _channel;
    protected string _actionName;

    public NoAskIntegrationBase(IChannel channel, string actionName)
    {
        _channel = channel;
        _actionName = actionName;
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
            // обрабатываем запрос
            await ProcessingAsync(request, payload, context);
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
            Console.WriteLine(ex.StackTrace);
            await ProcessingError(request, new { ErrorCode = "CommonException" }, ex.Message);
        }
    }

    private async Task ProcessingError(IntegrationRequest request, object? errorPayload, string errorMessage)
    {
        // todo блять сделай логи наконец заебал :/
    }

    public virtual string GetActionName()
    {
        return _actionName;
    }

    protected abstract Task ProcessingAsync(IntegrationRequest request, ReqPayload? payload, TContext context);

    public Type GetIntegrationContextType()
    {
        return typeof(TContext);
    }
}