using Filmograf.BaseLibrary.DataAccess.Providers;
using Filmograf.BaseLibrary.DataAccess.Repositories;
using Filmograf.BaseLibrary.Models.Dto;
using Filmograf.BaseLibrary.Models.Repo;
using Filmograf.SearchService.Caching;
using Filmograf.SearchService.Models.Dto;
using Filmograf.SearchService.Util;

namespace Filmograf.SearchService.Services;

public class SearchMovieService
{
    private readonly MovieRepository _movieRepository;
    private readonly SearchParsingService _searchParsingService;
    private readonly SearchCaching _searchCaching;

    
    public SearchMovieService(MovieRepository movieRepository, SearchParsingService searchParsingService, SearchCaching searchCaching)
    {
        _movieRepository = movieRepository;
        _searchParsingService = searchParsingService;
        _searchCaching = searchCaching;
    }
    
    private async Task HandleSearchParsingAsync(string query, string roomId)
    {
        await _searchParsingService.ParseSearchAsync(query, roomId);
    }

    private async Task<SearchPartResponseDto> CreateCacheForSearchFilmAsync(string query, PaginationQueryDto pagination, MovieSearchRequestDto? filters = null)
    {
        if (string.IsNullOrWhiteSpace(query))
            return new SearchPartResponseDto { Type = SearchPartType.Movie, EntityIds = Array.Empty<string>() };

        List<MovieRepo> movies;

        if (filters?.Genres != null)
        {
            movies = await _movieRepository.GetByNameWithFiltersAsync(
                query,
                filters.Genres.Include,
                filters.Genres.Exclude,
                filters.StrictMatch);
        }
        else
        {
            movies = await _movieRepository.GetByNameAsync(query);
        }

        var sortedMovies = !string.IsNullOrWhiteSpace(query)
            ? movies.SortByQuery(query, m => m.Name, m => m.Id)
            : movies.Select(i => i.Id);
        
        var pagedIds = sortedMovies
            .Skip(pagination.Page * pagination.Count)
            .Take(pagination.Count)
            .ToArray();
        
        if (!pagedIds.Any()) return new SearchPartResponseDto();

        
        return new SearchPartResponseDto { Type = SearchPartType.Movie, EntityIds = pagedIds };
    }
    
    public async Task<SearchPartResponseDto> SearchFilmAsync(string query, PaginationQueryDto pagination, string? roomId, MovieSearchRequestDto? filters = null)
    {
        if (roomId != null) await HandleSearchParsingAsync(query, roomId);
        
        var method = async () => await CreateCacheForSearchFilmAsync(query, pagination, filters);
        return await _searchCaching.CachingSearchingMoviesAsync(query, pagination, filters, method);
    }

    
    
}