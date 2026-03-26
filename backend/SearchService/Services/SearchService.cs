using System.Runtime.CompilerServices;
using Filmograf.BaseLibrary.DataAccess.Providers;
using Filmograf.BaseLibrary.DataAccess.Repositories;
using Filmograf.SearchService.Models.Dto;

namespace Filmograf.SearchService.Services;

public class SearchService
{
    
    private readonly MovieRepository _movieRepository;
    private readonly CollectionRepository _collectionRepository;
    private readonly CollectionTagProvider _tagProvider; 
    private readonly GenreProvider _genreProvider; 
    
    
    public SearchService(MovieRepository movieRepository, CollectionRepository collectionRepository, CollectionTagProvider tagProvider, GenreProvider genreProvider)
    {
        _movieRepository = movieRepository;
        _collectionRepository = collectionRepository;
        _tagProvider = tagProvider;
        _genreProvider = genreProvider;
    }
    
    public async Task<SearchPartResponseDto> SearchFilmAsync(string query)
    {
        if (string.IsNullOrWhiteSpace(query))
            return new SearchPartResponseDto { Type = SearchPartType.Movie, EntityIds = Array.Empty<string>() };

        var movies = await _movieRepository.GetByNameAsync(query);
        var sortedMovies = SortByQuery(movies, query, m => m.Name, m => m.Id);

        return new SearchPartResponseDto { Type = SearchPartType.Movie, EntityIds = sortedMovies };
    }
    
    public async Task<SearchPartResponseDto> SearchCollectionAsync(string query)
    {
        if (string.IsNullOrWhiteSpace(query))
            return new SearchPartResponseDto { Type = SearchPartType.Collection, EntityIds = Array.Empty<string>() };
        
        var collections = await _collectionRepository.GetByNameAsync(query);

        var sortedCollections = SortByQuery(collections, query, c => c.Name, c => c.Id);
        
        return new SearchPartResponseDto { Type = SearchPartType.Collection, EntityIds = sortedCollections };
    }
    
    public async Task<SearchPartResponseDto> SearchTagAsync(string query)
    {
        if (string.IsNullOrWhiteSpace(query))
            return new SearchPartResponseDto { Type = SearchPartType.Tag, EntityIds = Array.Empty<string>() };
        
        var tags = await _tagProvider.SearchAllByNameAsync(query);
        var sortedTags = SortByQuery(tags, query, t => t.Name, t => t.Id.ToString());
        
        return new SearchPartResponseDto { Type = SearchPartType.Tag, EntityIds = sortedTags };
    }
    
    public async Task<SearchPartResponseDto> SearchGenreAsync(string query)
    {
        if (string.IsNullOrWhiteSpace(query))
            return new SearchPartResponseDto { Type = SearchPartType.Genre, EntityIds = Array.Empty<string>() };
        
        var genres = await _genreProvider.SearchAllByNameAsync(query);
        var sortedGenres = SortByQuery(genres, query, t => t.Name, t => t.Id.ToString());
        
        return new SearchPartResponseDto { Type = SearchPartType.Genre, EntityIds = sortedGenres };
    }
    
    
    private string[] SortByQuery<T>(
        IEnumerable<T> items,
        string query,
        Func<T, string> nameSelector,
        Func<T, string> idSelector)
    {
        return items
            .Where(x => nameSelector(x).Contains(query, StringComparison.OrdinalIgnoreCase))
            .OrderBy(x => nameSelector(x).IndexOf(query, StringComparison.OrdinalIgnoreCase))
            .ThenBy(x => nameSelector(x).Length)
            .Select(x => idSelector(x))
            .ToArray();
    }
    
}