using Filmograf.BaseLibrary.Models.HttpExceptions;
using Filmograf.BaseLibrary.Services;

namespace Filmograf.AnalyticsService.Services.Personalized;

public class PersonalizedService
{
    private readonly TopPicksService _topPicksService;
    private readonly MoviesPersonalizedService _moviesPersonalizedService;
    private readonly CollectionsPersonalizedService _collectionsPersonalizedService;

    private delegate Task<IEnumerable<string>> HandleCompileChart(Guid userId);
    private readonly Dictionary<string, HandleCompileChart> _handlers;
    
    public PersonalizedService(MoviesPersonalizedService moviesPersonalizedService, TopPicksService topPicksService, 
        CollectionsPersonalizedService collectionsPersonalizedService)
    {
        _moviesPersonalizedService = moviesPersonalizedService;
        _topPicksService = topPicksService;
        _collectionsPersonalizedService = collectionsPersonalizedService;
        
        _handlers = new Dictionary<string, HandleCompileChart>
        {
            { "Movie", _moviesPersonalizedService.GenerateForUserAsync },
            { "Collection", _moviesPersonalizedService.GenerateForUserAsync }
        };
    }

    // entityType: Movie, Collection
    public async Task HandleCompileChartAsync(string entityType, Guid userId)
    {
        var handler = _handlers[entityType];
        if (handler == null) throw new BadRequestHttpException("InvalidEntityType");

        var chart = await handler(userId);
        
        var chartDictionary = new Dictionary<int, string>();
        int currentNewIndex = 1; // новая нумерацию с 1

        foreach (var movie in chart)
        {
            chartDictionary.Add(currentNewIndex, movie);
            currentNewIndex++;
        }

        await _topPicksService.SetUserTopPickAsync(entityType, userId, chartDictionary);
    }
}