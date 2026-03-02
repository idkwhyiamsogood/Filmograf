using Filmograf.BaseLibrary.Integrations.Hosted;
using Filmograf.BaseLibrary.Integrations.Requested;

namespace Filmograf.ParsingService.Services.Integrations;

public class RabbitMqRequestedServiceShell : RabbitMqRequestedServiceBase
{
    internal protected readonly static string[] Queues = new[] { "base_to_parser", "parser_to_base" }; // взаимодействуем
    
    public RabbitMqRequestedServiceShell()
        : base(Queues) { }
}