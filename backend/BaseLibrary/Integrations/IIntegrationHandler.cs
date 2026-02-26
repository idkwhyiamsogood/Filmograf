using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace Filmograf.BaseLibrary.Integrations;

public interface IIntegrationHandler
{
    Task ProcessMessageAsync(object sender, BasicDeliverEventArgs ea, IChannel channel, object context);

    string GetActionName();

    Type GetIntegrationContextType();
}