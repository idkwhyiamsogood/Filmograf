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
        {
            return new SearchPartResponseDto
            {
                Type = SearchPartType.Movie,
                EntityIds = Array.Empty<string>()
            };
        }
        var movies = await _movieRepository.GetByNameAsync(query);
        
        var sortedMovies = movies
            .Select(m => new
            {
                Movie = m,
                Index = m.Name.IndexOf(query, StringComparison.OrdinalIgnoreCase)
            })
            .Where(x => x.Index >= 0) 
            .OrderBy(x => x.Index)
            .ThenBy(x => x.Movie.Name.Length) 
            .Select(x => x.Movie)
            .ToList();

        var response = new SearchPartResponseDto
        {
            Type = SearchPartType.Movie,
            EntityIds = sortedMovies.Select(m => m.Id).ToArray()
        };
        
        return response;
    }
    
    public async Task<SearchPartResponseDto> SearchCollectionAsync(string query)
    {
        if (string.IsNullOrWhiteSpace(query))
        {
            return new SearchPartResponseDto
            {
                Type = SearchPartType.Collection,
                EntityIds = Array.Empty<string>()
            };
        }
        
        var collections = await _collectionRepository.GetByNameAsync(query);

        var sortedCollections = collections
            .Select(m => new
            {
                Movie = m,
                Index = m.Name.IndexOf(query, StringComparison.OrdinalIgnoreCase)
            })
            .Where(x => x.Index >= 0)
            .OrderBy(x => x.Index) 
            .ThenBy(x => x.Movie.Name.Length) 
            .Select(x => x.Movie)
            .ToList();
        
        var response = new SearchPartResponseDto
        {
            Type = SearchPartType.Collection,
            EntityIds = sortedCollections.Select(c => c.Id).ToArray()
        };

        
        return response;
    }
    
    public async Task<SearchPartResponseDto> SearchTagAsync(string query)
    {
        if (string.IsNullOrWhiteSpace(query))
        {
            return new SearchPartResponseDto
            {
                Type = SearchPartType.Tag,
                EntityIds = Array.Empty<string>()
            };
        }
        
        var tags = await _tagProvider.SearchAllByNameAsync(query);
        
        var sortedTags = tags
            .Select(t => new
            {
                Tag = t,
                Index = t.Name.IndexOf(query, StringComparison.OrdinalIgnoreCase)
            })
            .Where(x => x.Index >= 0)
            .OrderBy(x => x.Index)
            .ThenBy(x => x.Tag.Name.Length)
            .Select(x => x.Tag)
            .ToList();
        
        var response = new SearchPartResponseDto
        {
            Type = SearchPartType.Tag,
            EntityIds = sortedTags.Select(t => t.Id.ToString()).ToArray()
        };
        
        return response;
    }
    
    public async Task<SearchPartResponseDto> SearchGenreAsync(string query)
    {
        if (string.IsNullOrWhiteSpace(query))
        {
            return new SearchPartResponseDto
            {
                Type = SearchPartType.Genre,
                EntityIds = Array.Empty<string>()
            };
        }
    
        var genres = await _genreProvider.SearchAllByNameAsync(query);
    
        var sortedGenres = genres
            .Select(g => new
            {
                Genre = g,
                Index = g.Name.IndexOf(query, StringComparison.OrdinalIgnoreCase)
            })
            .Where(x => x.Index >= 0)
            .OrderBy(x => x.Index)
            .ThenBy(x => x.Genre.Name.Length)
            .Select(x => x.Genre)
            .ToList();
    
        var response = new SearchPartResponseDto
        {
            Type = SearchPartType.Genre,
            EntityIds = sortedGenres.Select(g => g.Id.ToString()).ToArray()
        };
    
        return response;
    }
    
}