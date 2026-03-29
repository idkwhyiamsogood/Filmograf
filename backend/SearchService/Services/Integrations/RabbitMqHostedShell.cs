using Filmograf.BaseLibrary.Integrations;
using Filmograf.BaseLibrary.Integrations.Hosted;
using Filmograf.BaseLibrary.Util;
using Filmograf.SearchService.Integration.Hosted;

namespace Filmograf.SearchService.Services.Integrations;

public class RabbitMqHostedService : RabbitMqHostedServiceBase
{
    internal protected readonly static string[] Queues = new[]
    {
        "parser_to_search", "search_to_parser",
        "movies_to_search", "search_to_movies",
    }; // взаимодействуем
    internal protected readonly static string[] Consumes = new[] { "parser_to_search", "movies_to_search" }; // слушаем

    public RabbitMqHostedService(RabbitConnectionSettings settings, IServiceScopeFactory scopeFactory) 
        : base(settings, scopeFactory, Queues, Consumes) { }

    protected override void InitListeners()
    {
        _integrationsBus = new Dictionary<string, IIntegrationHandler>();
        _integrationsBus["apply_search_parsing"] = new ReceiveParsingResultIntegration(_channel, "apply_search_parsing");
        // _integrationsBus["apply_films_details"] = new FilmsApplyDetailsIntegration(_channel, "apply_films_details");
        // _integrationsBus["complete_parsing"] = new CompleteParsingIntegration(_channel, "complete_parsing");
    }
}

public class RabbitMqHostedShell : BackgroundService
{
    private readonly IRabbitMqHostedService _rabbitService;

    public RabbitMqHostedShell(IServiceScopeFactory scopeFactory)
    {
        var settings = AppSettingsUtil.AppSettings.RabbitConnectionSettings;
        _rabbitService = new RabbitMqHostedService(settings, scopeFactory);
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await _rabbitService.StartAsync(stoppingToken);
    }

    public override async Task StopAsync(CancellationToken cancellationToken)
    {
        await _rabbitService.StopAsync();
        await base.StopAsync(cancellationToken);
    }
}