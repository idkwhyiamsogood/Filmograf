using System.ComponentModel;
using Filmograf.BaseLibrary.Util;
using Microsoft.Extensions.DependencyInjection;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace Filmograf.BaseLibrary.Integrations.Hosted;

public interface IRabbitMqService
{
    Task StartAsync(CancellationToken token);
    Task StopAsync();
}

public abstract class RabbitMqService : IRabbitMqService
{
    private readonly ConnectionFactory _factory;
    private readonly IServiceScopeFactory _scopeFactory;

    private IConnection _connection;
    private IChannel _channel;
    private Dictionary<string, IIntegrationHandler> _integrationsBus;
    private QueueDeclareData[] _queues;
    private QueueConsumeData[] _consumes;

    public RabbitMqService(RabbitConnectionSettings settings, IServiceScopeFactory scopeFactory, string[] queues, QueueConsumeData[] consumes)
        : this(settings, scopeFactory, QueueDeclareData.MapQueues(queues), consumes) { }

    public RabbitMqService(RabbitConnectionSettings settings, IServiceScopeFactory scopeFactory, QueueDeclareData[] queues, 
        QueueConsumeData[] consumes)
    {
        _scopeFactory = scopeFactory;
        _queues = queues;
        _consumes = consumes;
        
        _factory = new ConnectionFactory
        {
            HostName = settings.Host,
            UserName = settings.UserName,
            Password = settings.Password
        };
    }

    public virtual async Task StartAsync(CancellationToken token)
    {
        _connection = await _factory.CreateConnectionAsync();
        _channel = await _connection.CreateChannelAsync();

        await _channel.BasicQosAsync(0, 10, false);
        
        await DeclareQueuesAsync();
        
        InitListeners();

        var consumer = new AsyncEventingBasicConsumer(_channel);
        consumer.ReceivedAsync += OnMessage;

        await _channel.BasicConsumeAsync(
            queue: "main_to_parsing",
            autoAck: false,
            consumer: consumer
        );
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

    protected abstract void InitListeners();

    protected virtual async Task OnMessage(object sender, BasicDeliverEventArgs ea)
    {
        var data = SerializationUtil.DeserializeFromBytes<IntegrationRequest>(ea.Body.ToArray());
        if (data == null) return;

        var integration = _integrationsBus.GetValueOrDefault(data.Action);
        if (integration == null) return;

        using var scope = _scopeFactory.CreateScope();
        var ctxType = integration.GetIntegrationContextType();
        var ctx = scope.ServiceProvider.GetRequiredService(ctxType);

        await integration.ProcessMessageAsync(sender, ea, _channel, ctx);
    }

    public virtual async Task StopAsync()
    {
        if (_channel is not null) await _channel.CloseAsync();
        if (_connection is not null) await _connection.CloseAsync();
    }

    public virtual async ValueTask DisposeAsync() => await StopAsync();
}