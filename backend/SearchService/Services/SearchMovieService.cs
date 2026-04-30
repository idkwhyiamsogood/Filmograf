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
        // 1. Выходим ТОЛЬКО если и строка пустая, и фильтров нет
        if (string.IsNullOrWhiteSpace(query) && filters == null)
            return new SearchPartResponseDto { Type = SearchPartType.Movie, EntityIds = Array.Empty<string>() };

        List<MovieRepo> movies;

        if (filters != null)
        {
            // 2. Передаем ВСЕ поля из MovieSearchRequestDto в репозиторий
            movies = await _movieRepository.GetByNameWithFiltersAsync(
                query,
                filters.Genres?.Include,
                filters.Genres?.Exclude,
                filters.StrictMatch,
                filters.FromYearTo,   // Передаем года
                filters.FromGradeTo,  // Передаем оценки
                filters.AgeRating     // Передаем возрастной рейтинг
            );
        }
        else
        {
            movies = await _movieRepository.GetByNameAsync(query);
        }

        // 3. Исправляем логику: работаем сразу с ID (строками)
        IEnumerable<string> entityIds;

        if (!string.IsNullOrWhiteSpace(query))
        {
            // Раз SortByQuery возвращает string[], просто сохраняем их
            entityIds = movies.SortByQuery(query, m => m.Name, m => m.Id);
        }
        else
        {
            // Если запроса нет, просто берем ID из того, что нашел репозиторий
            entityIds = movies.Select(m => m.Id.ToString());
        }

        // 4. Пагинация теперь идет по списку строк
        var pagedIds = entityIds
            .Skip(pagination.Page * pagination.Count)
            .Take(pagination.Count)
            .ToArray();

        if (!pagedIds.Any()) 
            return new SearchPartResponseDto { Type = SearchPartType.Movie, EntityIds = Array.Empty<string>() };

        return new SearchPartResponseDto { Type = SearchPartType.Movie, EntityIds = pagedIds };
    }
    
    public async Task<SearchPartResponseDto> SearchFilmAsync(string query, PaginationQueryDto pagination, string? roomId, MovieSearchRequestDto? filters = null)
    {
        if (roomId != null) await HandleSearchParsingAsync(query, roomId);
        
        var method = async () => await CreateCacheForSearchFilmAsync(query, pagination, filters);
        return await _searchCaching.CachingSearchingMoviesAsync(query, pagination, filters, method);
    }
}