using System.ComponentModel.DataAnnotations;
using Filmograf.AnalyticsService.Services.Charts;
using Filmograf.BaseLibrary.Integrations;
using Filmograf.BaseLibrary.Integrations.Payload;
using RabbitMQ.Client;

namespace Filmograf.AnalyticsService.Integration.Hosted;

public class CompileChartIntegrationRequest : IntegrationRequestPayloadBase
{
    [RegularExpression("^(FilmTopMovies|FilmTopCollections)$")]
    public string ChartType { get; set; }
}

public class CompileChartIntegrationContext : IntegrationContextBase
{
    public readonly ChartService ChartService;

    public CompileChartIntegrationContext(ChartService chartService)
    {
        ChartService = chartService;
    }
}

public class CompileChartIntegration : NoAskIntegrationBase<CompileChartIntegrationRequest, CompileChartIntegrationContext>
{
    public CompileChartIntegration(IChannel channel, string actionName) : base(channel, actionName)
    {
    }

    protected override async Task ProcessingAsync(IntegrationRequest request, CompileChartIntegrationRequest? payload,
        CompileChartIntegrationContext context)
    {
        await context.ChartService.HandleCompileChartAsync(payload.ChartType);
    }
}