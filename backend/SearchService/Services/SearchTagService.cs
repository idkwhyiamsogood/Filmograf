using Filmograf.BaseLibrary.DataAccess.Providers;
using Filmograf.BaseLibrary.Models.Dto;
using Filmograf.SearchService.Caching;
using Filmograf.SearchService.Models.Dto;
using Filmograf.SearchService.Util;

namespace Filmograf.SearchService.Services;

public class SearchTagService
{
    private readonly CollectionTagProvider _tagProvider;
    private readonly SearchParsingService _searchParsingService;
    private readonly SearchCaching _searchCaching;

    public SearchTagService(CollectionTagProvider tagProvider, SearchParsingService searchParsingService, SearchCaching searchCaching)
    {
        _tagProvider = tagProvider;
        _searchParsingService = searchParsingService;
        _searchCaching = searchCaching;
    }

    private async Task HandleSearchParsingAsync(string query, string roomId)
    {
        await _searchParsingService.ParseSearchAsync(query, roomId);
    }

    private async Task<SearchPartResponseDto> CreateCacheForSearchTagAsync(string query, PaginationQueryDto pagination)
    {
        if (string.IsNullOrWhiteSpace(query))
            return new SearchPartResponseDto { Type = SearchPartType.Tag, EntityIds = Array.Empty<string>() };

        var tags = await _tagProvider.SearchAllByNameAsync(query);
        var sortedTags = tags.SortByQuery(query, t => t.Name, t => t.Id.ToString());

        var pagedIds = sortedTags
            .Skip(pagination.Page * pagination.Count)
            .Take(pagination.Count)
            .ToArray();

        if (!pagedIds.Any()) return new SearchPartResponseDto();
        return new SearchPartResponseDto { Type = SearchPartType.Tag, EntityIds = pagedIds };
    }

    public async Task<SearchPartResponseDto> SearchTagAsync(string query, PaginationQueryDto pagination, string? roomId)
    {
        if (roomId != null) await HandleSearchParsingAsync(query, roomId);

        var method = async () => await CreateCacheForSearchTagAsync(query, pagination);
        return await _searchCaching.CachingSearchingTagsAsync(query, pagination, method);
    }
}