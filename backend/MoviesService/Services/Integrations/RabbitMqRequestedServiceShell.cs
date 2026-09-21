using Filmograf.BaseLibrary.Integrations.Hosted;
using Filmograf.BaseLibrary.Integrations.Requested;

namespace Filmograf.MoviesService.Services.Integrations;

public class RabbitMqRequestedServiceShell : RabbitMqRequestedServiceBase
{
    internal protected readonly static string[] Queues = new[]
    {
        "parser_to_movies", "movies_to_parser",
        "analytics_to_movies", "movies_to_analytics",
        "search_to_movies", "movies_to_search",
    }; // взаимодействуем
    
    public RabbitMqRequestedServiceShell()
        : base(Queues) { }
}