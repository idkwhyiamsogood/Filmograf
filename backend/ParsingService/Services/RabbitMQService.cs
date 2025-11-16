using Filmograf.BaseLibrary.Integrations;
using Filmograf.BaseLibrary.Util;
using ParsingService.Integrations;
using ParsingService.Util;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace ParsingService.Services;

public class RabbitMQService
{
    private readonly ConnectionFactory _factory;
    private IConnection _connection;
    private IChannel _channel;
    private Dictionary<string, IIntegrationHandler> _integrationsBus;

    public RabbitMQService()
    {
        var settings = AppSettingsUtil.AppSettings.RabbitConnectionSettings;
        
        _factory = new ConnectionFactory
        {
            HostName = settings.Host,
            UserName = settings.UserName,
            Password = settings.Password
        };
    }
    
    public async Task ConnectAsync()
    {
        try
        {
            _connection = await _factory.CreateConnectionAsync();
            _channel = await _connection.CreateChannelAsync();

            await _channel.QueueDeclareAsync("base_to_parser", durable: true, exclusive: false, autoDelete: false,
                arguments: null);
            await _channel.QueueDeclareAsync("parser_to_base", durable: true, exclusive: false, autoDelete: false,
                arguments: null);

            InitListeners();
            StartListeners();
        }
        catch (Exception ex)
        {
            Console.WriteLine("Ошибка при подключении к серверу ampq.");
            Console.WriteLine(ex.StackTrace);
            throw ex;
        }
    }
    
    private void InitListeners()
    {
        _integrationsBus = new Dictionary<string, IIntegrationHandler>();
        _integrationsBus["test"] = new TestIntegration(_channel, "test", "parser_to_base");
    }

    private void StartListeners()
    {
        var consumer = new AsyncEventingBasicConsumer(_channel);
        consumer.ReceivedAsync += ProcessMessageAsync;
        
        _ = _channel.BasicConsumeAsync(
            queue: "base_to_parser",
            autoAck:  false,
            consumer: consumer
        );
    }

    public async Task ProcessMessageAsync(object sender, BasicDeliverEventArgs ea)
    {
        var data = SerializationUtil.DeserializeFromBytes<IntegrationRequest>(ea.Body.ToArray());
        if (data == null) return;

        await _integrationsBus[data.Action].ProcessMessageAsync(sender, ea);
    }

    public async ValueTask DisposeAsync()
    {
        if (_channel is not null) await _channel.CloseAsync();
        if (_connection is not null) await _connection.CloseAsync();
    }
}