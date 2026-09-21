using Filmograf.AnalyticsService.Integration.Hosted;
using Filmograf.BaseLibrary.Integrations;
using Filmograf.BaseLibrary.Integrations.Hosted;
using Filmograf.BaseLibrary.Util;

namespace Filmograf.AnalyticsService.Services.Integrations;

public class RabbitMqHostedService : RabbitMqHostedServiceBase
{
    internal protected readonly static string[] Queues = new[]
    {
        "analytics_to_movies", "movies_to_analytics",
        "analytics_to_collections", "collections_to_analytics",
    }; // взаимодействуем
    internal protected readonly static string[] Consumes = new[] { "movies_to_analytics", "collections_to_analytics" }; // слушаем

    public RabbitMqHostedService(RabbitConnectionSettings settings, IServiceScopeFactory scopeFactory) 
        : base(settings, scopeFactory, Queues, Consumes) { }

    protected override void InitListeners()
    {
        _integrationsBus = new Dictionary<string, IIntegrationHandler>();
        _integrationsBus["click_entity"] = new ClickEntityIntegration(_channel, "click_entity");
        _integrationsBus["compile_chart"] = new CompileChartIntegration(_channel, "compile_chart");
        _integrationsBus["compile_personalized"] = new CompilePersonalizedIntegration(_channel, "compile_personalized");
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