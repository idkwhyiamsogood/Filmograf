using Filmograf.BaseLibrary.Integrations;
using Filmograf.BaseLibrary.Integrations.Hosted;
using Filmograf.BaseLibrary.Util;

namespace Filmograf.CollectionsService.Services.Integrations;

public class RabbitMqHostedService : RabbitMqHostedServiceBase
{
    internal protected readonly static string[] Queues = new[]
    {
        "analytics_to_collections", "collections_to_analytics",
    }; // взаимодействуем
    internal protected readonly static string[] Consumes = new[] { "analytics_to_collections" }; // слушаем

    public RabbitMqHostedService(RabbitConnectionSettings settings, IServiceScopeFactory scopeFactory) 
        : base(settings, scopeFactory, Queues, Consumes) { }

    protected override void InitListeners()
    {
        _integrationsBus = new Dictionary<string, IIntegrationHandler>();
        // _integrationsBus["distinct_films"] = new FilmsDistinctIntegration(_channel, "distinct_films");
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