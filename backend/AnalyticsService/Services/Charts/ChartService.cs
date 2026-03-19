using Filmograf.BaseLibrary.Models.HttpExceptions;

namespace Filmograf.AnalyticsService.Services.Charts;

public class ChartService
{
    private readonly MoviesChartService _moviesChartService;

    private delegate Task<IEnumerable<string>> HandleCompileChart();
    private readonly Dictionary<string, HandleCompileChart> _handlers;
    
    public ChartService(MoviesChartService moviesChartService)
    {
        _moviesChartService = moviesChartService;
        
        _handlers = new Dictionary<string, HandleCompileChart>
        {
            { "FilmTopMovies", _moviesChartService.HandleCompileTopChartAsync }
        };
    }

    public async Task HandleCompileChartAsync(string chartType)
    {
        var handler = _handlers[chartType];
        if (handler == null) throw new BadRequestHttpException("InvalidChartType");

        var chart = await handler();
        
        var chartDictionary = new Dictionary<int, string>();
        int currentNewIndex = 1; // новая нумерацию с 1

        foreach (var movie in chart)
        {
            chartDictionary.Add(currentNewIndex, movie);
            currentNewIndex++;
        }
    }
}