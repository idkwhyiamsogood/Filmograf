using AutoMapper;
using Elastic.Clients.Elasticsearch;
using Filmograf.BaseLibrary.DataAccess.Repositories;
using Filmograf.BaseLibrary.Models.Repo;
using Filmograf.BaseLibrary.Models.SearchIndexes;
using Filmograf.SearchIndexerService.DataAccess.IndexProviders;

namespace Filmograf.SearchIndexerService.Services;

public class MovieSearchIndexService
{
    private readonly IMapper _mapper;
    private readonly MovieSearchIndexProvider _movieSearchIndexProvider;
    private readonly MovieRepository _movieRepository; // scoped
    
    public MovieSearchIndexService(IMapper mapper, MovieSearchIndexProvider movieSearchIndexProvider, MovieRepository movieRepository)
    {
        _mapper = mapper;
        _movieSearchIndexProvider = movieSearchIndexProvider;
        _movieRepository = movieRepository;
    }

    public async Task ReindexAllMoviesAsync(int batchSize = 1000, CancellationToken ct = default)
    {
        using var cursor = await _movieRepository.GetCursorAsync(ct);

        while (await cursor.MoveNextAsync(cancellationToken: ct))
        {
            var mongoMovies = cursor.Current;
            if (!mongoMovies.Any()) continue;

            // маппим
            var searchIndexes = _mapper.Map<MovieSearchIndex[]>(mongoMovies);

            // отправляем в Elastic
            var bulkResponse = await _movieSearchIndexProvider.IndexMoviesAsync(searchIndexes, ct);

            // todo: логгирование настрой блять заебал уже
            if (bulkResponse.IsSuccess())
                Console.WriteLine($"Обработано {searchIndexes.Length} фильмов.");
            else
                Console.WriteLine($"Ошибка батча: {bulkResponse.DebugInformation}");
        }
    }
    
    public async Task ReindexMoviesByIdsAsync(IEnumerable<string> movieIds, CancellationToken ct = default)
    {
        // загружаем фильмы
        var movies = await _movieRepository.GetByIdsAsync(movieIds, ct);
        
        // маппим
        var searchIndexes = _mapper.Map<MovieSearchIndex[]>(movies);

        // отправляем в Elastic
        var bulkResponse = await _movieSearchIndexProvider.IndexMoviesAsync(searchIndexes, ct);

        // todo: логгирование настрой блять заебал уже
        if (bulkResponse.IsSuccess())
            Console.WriteLine($"Обработано {searchIndexes.Length} фильмов.");
        else
            Console.WriteLine($"Ошибка батча: {bulkResponse.DebugInformation}");
    }

    public async Task ReindexMoviesAsync(IEnumerable<MovieRepo> movies, CancellationToken ct = default)
    {
        // маппим
        var searchIndexes = _mapper.Map<MovieSearchIndex[]>(movies);

        // отправляем в Elastic
        var bulkResponse = await _movieSearchIndexProvider.IndexMoviesAsync(searchIndexes, ct);

        // todo: логгирование настрой блять заебал уже
        if (bulkResponse.IsSuccess())
            Console.WriteLine($"Обработано {searchIndexes.Length} фильмов.");
        else
            Console.WriteLine($"Ошибка батча: {bulkResponse.DebugInformation}");
    }
}