using Filmograf.BaseLibrary.DataAccess.Repositories;
using Filmograf.BaseLibrary.Models.Dto;
using Filmograf.BaseLibrary.Models.Repo;
using Filmograf.SearchService.Caching;
using Filmograf.SearchService.Models.Dto;
using Filmograf.SearchService.Util;

namespace Filmograf.SearchService.Services;

public class SearchCollectionService
{
    private readonly CollectionRepository _collectionRepository;
    private readonly SearchParsingService _searchParsingService;
    private readonly SearchCaching _searchCaching;

    public SearchCollectionService(CollectionRepository collectionRepository, SearchParsingService searchParsingService, SearchCaching searchCaching)
    {
        _collectionRepository = collectionRepository;
        _searchParsingService = searchParsingService;
        _searchCaching = searchCaching;
    }

    private async Task HandleSearchParsingAsync(string query, string roomId)
    {
        await _searchParsingService.ParseSearchAsync(query, roomId);
    }

    private async Task<SearchPartResponseDto> CreateCacheForSearchCollectionAsync(string query, PaginationQueryDto pagination, CollectionSearchRequestDto? filters = null)
    {
        // выходим только если нет ни запроса, ни фильтров
        if (string.IsNullOrWhiteSpace(query) && filters == null)
            return new SearchPartResponseDto { Type = SearchPartType.Collection, EntityIds = Array.Empty<string>() };

        List<CollectionRepo> collections;

        // ищем с фильтрами или без
        if (filters != null)
        {
            collections = await _collectionRepository.GetByNameWithFiltersAsync(
                query,
                filters.Genres?.Include,
                filters.Genres?.Exclude,
                filters.Tags?.Include,
                filters.Tags?.Exclude,
                filters.StrictMatch);
        }
        else
        {
            collections = await _collectionRepository.GetByNameAsync(query);
        }

        IEnumerable<string> entityIds = !string.IsNullOrWhiteSpace(query)
            ? collections.SortByQuery(query, c => c.Name, c => c.Id)
            : collections.Select(c => c.Id.ToString());

        // пагинация по строковым ID
        var pagedIds = entityIds
            .Skip(pagination.Page * pagination.Count)
            .Take(pagination.Count)
            .ToArray();

        // возвращаем корректный пустой массив, а не null
        if (!pagedIds.Any()) return new SearchPartResponseDto { Type = SearchPartType.Collection, EntityIds = Array.Empty<string>() };
        return new SearchPartResponseDto { Type = SearchPartType.Collection, EntityIds = pagedIds };
    }

    public async Task<SearchPartResponseDto> SearchCollectionAsync(string query, PaginationQueryDto pagination, string? roomId, CollectionSearchRequestDto? filters = null)
    {
        if (roomId != null) await HandleSearchParsingAsync(query, roomId);

        var method = async () => await CreateCacheForSearchCollectionAsync(query, pagination, filters);
        return await _searchCaching.CachingSearchingCollectionAsync(query, pagination, filters, method);
    }
}