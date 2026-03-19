using Filmograf.BaseLibrary.Integrations.Requested;
using Filmograf.MoviesService.Integration.Requested;

namespace Filmograf.MoviesService.Services;

public class MoviesChartService
{
    private readonly IRabbitMqRequestedService _rabbitMqService;
    
    public MoviesChartService(IRabbitMqRequestedService rabbitMqService)
    {
        _rabbitMqService = rabbitMqService;
    }
    
    public async Task CompileChartAsync()
    {
        var request = new CompileChartIntegrationRequest
        { ChartType = "FilmTopMovies" };
        
        await _rabbitMqService.SendNoReplyAsync("compile_chart", "movies_to_analytics", request);
    }
}