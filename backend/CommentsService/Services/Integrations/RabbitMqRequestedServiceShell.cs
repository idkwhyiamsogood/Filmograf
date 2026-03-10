using Filmograf.BaseLibrary.Integrations.Hosted;
using Filmograf.BaseLibrary.Integrations.Requested;

namespace Filmograf.CommentsService.Services.Integrations;

public class RabbitMqRequestedServiceShell : RabbitMqRequestedServiceBase
{
    internal protected readonly static string[] Queues = new[] { "parser_to_movies", "movies_to_parser" }; // взаимодействуем
    
    public RabbitMqRequestedServiceShell()
        : base(Queues) { }
}