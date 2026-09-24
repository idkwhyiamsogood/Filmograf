using Filmograf.BaseLibrary.Integrations.Hosted;
using Filmograf.BaseLibrary.Integrations.Requested;

namespace Filmograf.SearchIndexerService.Services.Integrations;

public class RabbitMqRequestedServiceShell : RabbitMqRequestedServiceBase
{
    internal protected readonly static string[] Queues = new[]
    {
        "analytics_to_searchIndexer", "searchIndexer_to_analytics",
        "movies_to_searchIndexer", "searchIndexer_to_movies",
    }; // взаимодействуем
    
    public RabbitMqRequestedServiceShell()
        : base(Queues) { }
}