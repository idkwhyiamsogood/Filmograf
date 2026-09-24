using Filmograf.BaseLibrary.DataAccess.Providers;
using Filmograf.BaseLibrary.Models.Dto;
using Filmograf.SearchService.Caching;
using Filmograf.SearchService.Models.Dto;
using Filmograf.SearchService.Util;

namespace Filmograf.SearchService.Services;

public class SearchGenreService
{
    private readonly GenreProvider _genreProvider;
    private readonly SearchCaching _searchCaching;

    public SearchGenreService(GenreProvider genreProvider, SearchCaching searchCaching)
    {
        _genreProvider = genreProvider;
        _searchCaching = searchCaching;
    }

    private async Task<SearchPartResponseDto> CreateCacheForSearchGenreAsync(string query, PaginationQueryDto pagination)
    {
        if (string.IsNullOrWhiteSpace(query))
            return new SearchPartResponseDto { Type = SearchPartType.Genre, EntityIds = Array.Empty<string>() };

        var genres = await _genreProvider.SearchAllByNameAsync(query);
        var sortedGenres = genres.SortByQuery(query, t => t.Name, t => t.Id.ToString());

        var pagedIds = sortedGenres
            .Skip(pagination.Page * pagination.Count)
            .Take(pagination.Count)
            .ToArray();

        if (!pagedIds.Any()) return new SearchPartResponseDto();
        return new SearchPartResponseDto { Type = SearchPartType.Genre, EntityIds = pagedIds };
    }

    public async Task<SearchPartResponseDto> SearchGenreAsync(string query, PaginationQueryDto pagination)
    {
        var method = async () => await CreateCacheForSearchGenreAsync(query, pagination);
        return await _searchCaching.CachingSearchingGenresAsync(query, pagination, method);
    }
}