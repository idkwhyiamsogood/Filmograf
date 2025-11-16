using RabbitMQ.Client;
using RabbitMQ.Client.Events;

using Filmograf.BaseLibrary.Integrations;
using Filmograf.BaseLibrary.Integrations.Payload;
using Filmograf.BaseLibrary.Util;
using Filmograf.MoviesService.Integration;
using Filmograf.MoviesService.Util;

namespace Filmograf.MoviesService.Services;

public class RabbitMQService
{
    private readonly ConnectionFactory _factory;
    private IConnection _connection;
    private IChannel _channel;
    private Dictionary<string, BaseIntegrationSender> _integrationSenders;

    public RabbitMQService()
    {
        var settings = AppSettingsUtil.AppSettings.RabbitConnectionSettings;
        
        _factory = new ConnectionFactory
        {
            HostName = settings.Host,
            UserName = settings.UserName,
            Password = settings.Password
        };
        
        _integrationSenders = new Dictionary<string, BaseIntegrationSender>();
        ConnectAsync().GetAwaiter().GetResult();
    }
    
    public async Task ConnectAsync()
    {
        try
        {
            _connection = await _factory.CreateConnectionAsync();
            _channel = await _connection.CreateChannelAsync();

            // Объявляем очереди
            await _channel.QueueDeclareAsync("base_to_parser", durable: true, exclusive: false, autoDelete: false);
            await _channel.QueueDeclareAsync("parser_to_base", durable: true, exclusive: false, autoDelete: false);

            InitSenders();
            StartResponseListener();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Ошибка при подключении к RabbitMQ: {ex.Message}");
            throw;
        }
    }
    
    private void InitSenders()
    {
        _integrationSenders["test"] = new TestIntegrationSender(_channel, "test", "base_to_parser", "parser_to_base");
    }
    
    private void StartResponseListener()
    {
        var consumer = new AsyncEventingBasicConsumer(_channel);
        consumer.ReceivedAsync += ProcessResponseAsync;
        
        _ = _channel.BasicConsumeAsync(
            queue: "parser_to_base",
            autoAck: false,
            consumer: consumer
        );
    }
    
    private async Task ProcessResponseAsync(object sender, BasicDeliverEventArgs ea)
    {
        try
        {
            var response = SerializationUtil.DeserializeFromBytes<IntegrationResponse>(ea.Body.ToArray());
            if (response == null) return;

            // Обрабатываем ответ в соответствующем sender'е
            if (_integrationSenders.TryGetValue(GetActionFromResponse(response.Action), out var senderHandler))
            {
                await senderHandler.ProcessResponseAsync(response);
            }
            
            await _channel.BasicAckAsync(ea.DeliveryTag, false);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Ошибка при обработке ответа: {ex.Message}");
            await _channel.BasicNackAsync(ea.DeliveryTag, false, true);
        }
    }
    
    private string GetActionFromResponse(string responseAction)
    {
        // Преобразуем "test_response" обратно в "test"
        return responseAction.Replace("_response", "");
    }
    
    public async Task<TResponse> SendRequestAsync<TRequest, TResponse>(string action, TRequest? payload = null)
        where TRequest : IntegrationRequestPayloadBase
        where TResponse : IntegrationResponsePayloadBase
    {
        if (!_integrationSenders.TryGetValue(action, out var sender))
        {
            throw new InvalidOperationException($"Integration sender for action '{action}' not found");
        }
    
        return await sender.SendRequestAsync<TRequest, TResponse>(payload);
    }
    
    public async ValueTask DisposeAsync()
    {
        if (_channel != null) await _channel.CloseAsync();
        if (_connection != null) await _connection.CloseAsync();
    }
}