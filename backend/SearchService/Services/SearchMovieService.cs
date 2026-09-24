using Filmograf.BaseLibrary.DataAccess.Repositories;
using Filmograf.BaseLibrary.Models.Dto;
using Filmograf.SearchService.Caching;
using Filmograf.SearchService.DataAccess.IndexProviders;
using Filmograf.SearchService.Models.Dto;

namespace Filmograf.SearchService.Services;

public class SearchMovieService
{
    private readonly SearchParsingService _searchParsingService;
    private readonly SearchCaching _searchCaching;
    private readonly MovieSearchIndexProvider _movieSearchIndexProvider;
    private readonly CollectionRepository _collectionRepository;

    public SearchMovieService(SearchParsingService searchParsingService, SearchCaching searchCaching, 
        MovieSearchIndexProvider movieSearchIndexProvider, CollectionRepository collectionRepository)
    {
        _searchParsingService = searchParsingService;
        _searchCaching = searchCaching;
        _movieSearchIndexProvider = movieSearchIndexProvider;
        _collectionRepository = collectionRepository;
    }
    
    private async Task HandleSearchParsingAsync(string query, string roomId)
    {
        await _searchParsingService.ParseSearchAsync(query, roomId);
    }

    private async Task<List<string>> ExcludeCollectionsAsync(IEnumerable<string> sourceMovies, IEnumerable<string> collectionsIds)
    {
        // загружаем коллекции
        var collections = await _collectionRepository.GetByIdsAsync(collectionsIds);

        // получаем перечень ids фильмов в коллекции
        var collectionMovies = collections
            .SelectMany(item => item.Movies)
            .Distinct();
        
        // возвращаем фильмы, id которых не содержаться в коллекциях
        return collectionsIds
            .Where(item => !collectionMovies.Contains(item))
            .ToList();
    }

    private async Task<SearchPartResponseDto> CreateCacheForSearchFilmAsync(string query, PaginationQueryDto pagination, 
        MovieSearchRequestDto? filters = null, bool allowFuzziness = true)
    {
        // выходим ТОЛЬКО если и строка пустая, и фильтров нет
        if (string.IsNullOrWhiteSpace(query) && filters == null)
            return new SearchPartResponseDto { Type = SearchPartType.Movie, EntityIds = Array.Empty<string>() };

        // получаем ids фильмов по фильтрам
        List<string> movieIds = filters != null
            ? await _movieSearchIndexProvider.SearchWithFiltersAsync(query, filters, allowFuzziness)
            : await _movieSearchIndexProvider.SearchMoviesAsync(query, allowFuzziness);
        
        // дополнительно фильтруем по excludeCollections
        if (filters?.ExcludeCollections != null && filters.ExcludeCollections.Any())
            movieIds = await ExcludeCollectionsAsync(movieIds, filters.ExcludeCollections);

        // пагинация теперь идет по списку строк
        var pagedIds = movieIds
            .Skip(pagination.Page * pagination.Count)
            .Take(pagination.Count)
            .ToArray();

        if (!pagedIds.Any()) return new SearchPartResponseDto { Type = SearchPartType.Movie, EntityIds = Array.Empty<string>() };
        return new SearchPartResponseDto { Type = SearchPartType.Movie, EntityIds = pagedIds };
    }

    public async Task<SearchPartResponseDto> SearchFilmAsync(string query, PaginationQueryDto pagination, string? roomId, 
        MovieSearchRequestDto? filters = null, bool allowFuzziness = true)
    {
        if (roomId != null) await HandleSearchParsingAsync(query, roomId);
        
        var method = async () => await CreateCacheForSearchFilmAsync(query, pagination, filters, allowFuzziness);
        return await _searchCaching.CachingSearchingMoviesAsync(query, filters, allowFuzziness, pagination, method);
    }
}