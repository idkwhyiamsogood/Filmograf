using Filmograf.BaseLibrary.Integrations.Requested;
using Filmograf.CollectionsService.Integration.Requested;

namespace Filmograf.CollectionsService.Services;

public class CollectionsChartService
{
    private readonly IRabbitMqRequestedService _rabbitMqService;
    
    public CollectionsChartService(IRabbitMqRequestedService rabbitMqService)
    {
        _rabbitMqService = rabbitMqService;
    }
    
    public async Task CompileChartAsync()
    {
        var request = new CompileChartIntegrationRequest
        { ChartType = "FilmTopCollections" };
        
        await _rabbitMqService.SendNoReplyAsync("compile_chart", "collections_to_analytics", request);
    }
}