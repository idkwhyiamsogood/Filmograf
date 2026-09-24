using Filmograf.BaseLibrary.Integrations;
using Filmograf.BaseLibrary.Integrations.Hosted;
using Filmograf.BaseLibrary.Util;
using Filmograf.SearchIndexerService.Integration.Hosted;

namespace Filmograf.SearchIndexerService.Services.Integrations;

public class RabbitMqHostedService : RabbitMqHostedServiceBase
{
    internal protected readonly static string[] Queues = new[]
    {
        "analytics_to_searchIndexer", "searchIndexer_to_analytics",
        "movies_to_searchIndexer", "searchIndexer_to_movies",
    }; // взаимодействуем
    internal protected readonly static string[] Consumes = new[] { "analytics_to_searchIndexer", "movies_to_searchIndexer" }; // слушаем

    public RabbitMqHostedService(RabbitConnectionSettings settings, IServiceScopeFactory scopeFactory) 
        : base(settings, scopeFactory, Queues, Consumes) { }

    protected override void InitListeners()
    {
        _integrationsBus = new Dictionary<string, IIntegrationHandler>();
        _integrationsBus["pick_movie"] = new PickMovieUpdateIntegration(_channel, "pick_movie");
        // ...
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