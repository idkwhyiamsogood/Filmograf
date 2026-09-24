using Filmograf.BaseLibrary.Services;

namespace Filmograf.SearchIndexerService.Services;

public class MoviesReindexService
{
    private readonly DeferredQueuePickService _deferredQueuePickService;
    private readonly MovieSearchIndexService _movieSearchIndexService;
    
    public MoviesReindexService(DeferredQueuePickService deferredQueuePickService, MovieSearchIndexService movieSearchIndexService)
    {
        _deferredQueuePickService = deferredQueuePickService;
        _movieSearchIndexService = movieSearchIndexService;
    }

    private readonly string _deferredQueueName = "MoviePick";
    public async Task ReindexPickedMoviesAsync(CancellationToken ct)
    {
        // достаем фильмы которые необходимо заново проиндексировать
        var movieIds = await _deferredQueuePickService.PullIdsAsync(_deferredQueueName);
            
        // индексируем фильмы по ids
        await _movieSearchIndexService.ReindexMoviesByIdsAsync(movieIds, ct);
    }
}