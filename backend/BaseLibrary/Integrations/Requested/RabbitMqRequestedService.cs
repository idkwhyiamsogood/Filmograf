using Filmograf.BaseLibrary.Integrations.Hosted;
using Filmograf.BaseLibrary.Integrations.Payload;
using Filmograf.BaseLibrary.Util;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace Filmograf.BaseLibrary.Integrations.Requested;

public interface IRabbitMqRequestedService
{
    Task SendNoReplyAsync<TRequest>(string action, string routing, TRequest? payload = null)
        where TRequest : IntegrationRequestPayloadBase;
}

public abstract class RabbitMqRequestedServiceBase : IRabbitMqRequestedService
{
    private readonly ConnectionFactory _factory;
    private IConnection _connection;
    private IChannel _channel;
    protected QueueDeclareData[] _queues; // все очереди с которыми взаимодействуем

    protected RabbitMqRequestedServiceBase(string[] queues)
        : this(QueueDeclareData.MapQueues(queues)) { }

    protected RabbitMqRequestedServiceBase(QueueDeclareData[] queues)
    {
        _queues = queues;
        
        var settings = AppSettingsUtil.AppSettings.RabbitConnectionSettings;
        
        _factory = new ConnectionFactory
        {
            HostName = settings.Host,
            UserName = settings.UserName,
            Password = settings.Password
        };
        
        ConnectAsync().GetAwaiter().GetResult();
    }
    
    protected virtual async Task ConnectAsync()
    {
        try
        {
            _connection = await _factory.CreateConnectionAsync();
            _channel = await _connection.CreateChannelAsync();

            // Настройка BasicQos для параллельной обработки ответов
            // PrefetchCount = 10 означает, что consumer может получить до 10 ответов одновременно
            await _channel.BasicQosAsync(prefetchSize: 0, prefetchCount: 10, global: false);

            // Объявляем очереди
            await DeclareQueuesAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Ошибка при подключении к RabbitMQ: {ex.Message}");
            throw;
        }
    }

    protected virtual async Task DeclareQueuesAsync()
    {
        foreach (var queue in _queues)
        {
            await _channel.QueueDeclareAsync(
                queue: queue.QueueName, 
                durable: queue.Durable, 
                exclusive: queue.Exclusive, 
                autoDelete: queue.AutoDelete
            );
        }
    }
    
    public virtual async Task SendNoReplyAsync<TRequest>(string action, string routing, TRequest? payload = null)
        where TRequest : IntegrationRequestPayloadBase
    {
        var requestId = Guid.NewGuid().ToString();
        
        var request = new IntegrationRequest
        {
            RequestId = requestId,
            Action = action,
            Payload = payload != null ? SerializationUtil.Serialize(payload) : null
        };
        
        var requestBytes = SerializationUtil.SerializeToBytes(request);
        
        await _channel.BasicPublishAsync(
            exchange: "",
            routingKey: routing,
            body: requestBytes
        );
    }
    
    // todo: сейчас 0:25 я не в кондициях такое писать)) потом сделать надо
    // public async Task<TResponse?> SendWithReplyAsync<TRequest, TResponse>(string action, string routing, 
    //     TRequest? payload = null, int timeoutMs = 30000)
    //     where TRequest : IntegrationRequestPayloadBase
    //     where TResponse : IntegrationResponsePayloadBase
    // {
    //     var requestId = Guid.NewGuid().ToString();
    //
    //     // Временная очередь для ответа
    //     var replyQueue = (await _channel.QueueDeclareAsync(
    //         queue: "",
    //         durable: false,
    //         exclusive: true,
    //         autoDelete: true
    //     )).QueueName;
    //
    //     var tcs = new TaskCompletionSource<TResponse?>(
    //         TaskCreationOptions.RunContinuationsAsynchronously
    //     );
    //
    //     var consumer = new AsyncEventingBasicConsumer(_channel);
    //
    //     consumer.ReceivedAsync += async (sender, ea) =>
    //     {
    //         try
    //         {
    //             if (ea.BasicProperties.CorrelationId != requestId)
    //                 return;
    //
    //             var response = SerializationUtil.DeserializeFromBytes<IntegrationResponse>(ea.Body.ToArray());
    //             if (response?.Payload == null)
    //             {
    //                 tcs.TrySetResult(null);
    //                 return;
    //             }
    //
    //             var payloadObj = SerializationUtil.Deserialize<TResponse>(response.Payload);
    //             tcs.TrySetResult(payloadObj);
    //         }
    //         catch (Exception ex)
    //         {
    //             tcs.TrySetException(ex);
    //         }
    //         finally
    //         {
    //             await _channel.BasicAckAsync(ea.DeliveryTag, false);
    //         }
    //     };
    //
    //     await _channel.BasicConsumeAsync(
    //         queue: replyQueue,
    //         autoAck: false,
    //         consumer: consumer
    //     );
    //
    //     var props = new BasicProperties
    //     {
    //         ReplyTo = replyQueue,
    //         CorrelationId = requestId
    //     };
    //
    //     var request = new IntegrationRequest
    //     {
    //         RequestId = requestId,
    //         Action = action,
    //         Payload = payload != null ? SerializationUtil.Serialize(payload) : null
    //     };
    //
    //     var requestBytes = SerializationUtil.SerializeToBytes(request);
    //
    //     await _channel.BasicPublishAsync(
    //         exchange: "",
    //         routingKey: routing,
    //         basicProperties: props,
    //         body: requestBytes
    //     );
    //
    //     using var cts = new CancellationTokenSource(timeoutMs);
    //
    //     await using (cts.Token.Register(() =>
    //         tcs.TrySetException(new TimeoutException("RabbitMQ reply timeout"))))
    //     {
    //         return await tcs.Task;
    //     }
    // }
}