using Filmograf.BaseLibrary.Integrations;
using Filmograf.BaseLibrary.Integrations.Hosted;
using Filmograf.BaseLibrary.Util;
using Filmograf.ParsingService.Integration.Hosted;

namespace Filmograf.ParsingService.Services.Integrations;

public class RabbitMqHostedService : RabbitMqHostedServiceBase
{
    internal protected readonly static string[] Queues = new[]
    {
        "parser_to_movies", "movies_to_parser",
        "parser_to_search", "search_to_parser"
    }; // взаимодействуем
    internal protected readonly static string[] Consumes = new[] { "movies_to_parser", "search_to_parser" }; // слушаем

    public RabbitMqHostedService(RabbitConnectionSettings settings, IServiceScopeFactory scopeFactory) 
        : base(settings, scopeFactory, Queues, Consumes) { }

    protected override void InitListeners()
    {
        _integrationsBus = new Dictionary<string, IIntegrationHandler>();
        _integrationsBus["parse_top_films"] = new ParseMoviesIntegration(_channel, "parse_top_films");
        _integrationsBus["parse_details"] = new ParseMoviesDetailsIntegration(_channel, "parse_details");
        _integrationsBus["parse_one_details"] = new ParseOneMovieDetailsIntegration(_channel, "parse_one_details");
        _integrationsBus["parse_search"] = new ParseSearchingIntegration(_channel, "parse_search");
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