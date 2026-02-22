using RabbitMQ.Client;

namespace Filmograf.MoviesService.Integration;

public class TestIntegrationSender : BaseIntegrationSender
{
    public TestIntegrationSender(IChannel channel, string actionName, string requestQueue, string responseQueue) : 
        base(channel, actionName, requestQueue, responseQueue)
    {
    }
}