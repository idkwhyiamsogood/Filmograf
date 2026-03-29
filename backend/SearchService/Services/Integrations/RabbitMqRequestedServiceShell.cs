using Filmograf.BaseLibrary.Integrations.Hosted;
using Filmograf.BaseLibrary.Integrations.Requested;

namespace Filmograf.SearchService.Services.Integrations;

public class RabbitMqRequestedServiceShell : RabbitMqRequestedServiceBase
{
    internal protected readonly static string[] Queues = new[]
    {
        "parser_to_search", "search_to_parser",
        "movies_to_search", "search_to_movies",
        
    }; // взаимодействуем
    
    public RabbitMqRequestedServiceShell()
        : base(Queues) { }
}