using System.ComponentModel;
using Filmograf.BaseLibrary.Util;
using Microsoft.Extensions.DependencyInjection;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace Filmograf.BaseLibrary.Integrations.Hosted;

public interface IRabbitMqHostedService
{
    Task StartAsync(CancellationToken token);
    Task StopAsync();
}

// базовый прототип хост-хендлера RabbitMQ
public abstract class RabbitMqHostedServiceBase : IRabbitMqHostedService
{
    protected readonly ConnectionFactory _factory;
    protected readonly IServiceScopeFactory _scopeFactory;

    protected IConnection _connection;
    protected IChannel _channel;
    protected Dictionary<string, IIntegrationHandler> _integrationsBus; // все интеграции
    protected QueueDeclareData[] _queues; // все очереди с которыми взаимодействуем
    protected QueueConsumeData[] _consumes; // очереди которые обрабатываем

    protected RabbitMqHostedServiceBase(RabbitConnectionSettings settings, IServiceScopeFactory scopeFactory, string[] queues, string[] consumes)
        : this(settings, scopeFactory, QueueDeclareData.MapQueues(queues), QueueConsumeData.MapConsumes(consumes)) { }

    protected RabbitMqHostedServiceBase(RabbitConnectionSettings settings, IServiceScopeFactory scopeFactory, QueueDeclareData[] queues, 
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

        // типа базовая настройка хз
        // todo: prefetchCount, prefetchSize, isGlobal - через конструктор можно передавать
        await _channel.BasicQosAsync(0, 10, false);
        
        // объявляем очереди
        await DeclareQueuesAsync();
        
        // настраиваем потребителей (consumers) для очередей
        // очереди, которые будем обрабатывать
        await DeclareConsumersAsync();
        
        // предполагается что в дочернем классе-имплементоре будем инициализировать интеграции
        InitListeners();
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

    protected virtual async Task DeclareConsumersAsync()
    {
        foreach (var consume in _consumes)
        {
            var consumer = new AsyncEventingBasicConsumer(_channel);
            
            // p.s. в идеале для каждой очереди - свой хендлер, но так тоже будет работать, т.к. в BaseMessageHandler
            // чекаем к какой очереди относяться входящие сообщения
            consumer.ReceivedAsync += BaseMessageHandler;

            await _channel.BasicConsumeAsync(
                queue: consume.QueueName,
                autoAck: consume.AutoAck,
                consumer: consumer
            );
        }
    }

    /*
        // что то типа:
        _integrationsBus = new Dictionary<string, IIntegrationHandler>();
        _integrationsBus["parse_avatar"] = new ParseAvatarIntegration(_channel, "parse_avatar");
     */
    protected abstract void InitListeners();

    protected virtual async Task BaseMessageHandler(object sender, BasicDeliverEventArgs ea)
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