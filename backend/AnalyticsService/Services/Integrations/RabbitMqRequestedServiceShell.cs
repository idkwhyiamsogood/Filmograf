using Filmograf.BaseLibrary.Integrations.Hosted;
using Filmograf.BaseLibrary.Integrations.Requested;

namespace Filmograf.AnalyticsService.Services.Integrations;

public class RabbitMqRequestedServiceShell : RabbitMqRequestedServiceBase
{
    internal protected readonly static string[] Queues = new[]
    {
        "analytics_to_movies", "movies_to_analytics",
        "analytics_to_collections", "collections_to_analytics"
    }; // взаимодействуем
    
    public RabbitMqRequestedServiceShell()
        : base(Queues) { }
}