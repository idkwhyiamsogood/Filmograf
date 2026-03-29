using System.Runtime.CompilerServices;
using Filmograf.BaseLibrary.DataAccess.Providers;
using Filmograf.BaseLibrary.DataAccess.Repositories;
using Filmograf.BaseLibrary.Models.Repo;
using Filmograf.SearchService.Hubs;
using Filmograf.SearchService.Models.Dto;
using Filmograf.SearchService.Util;
using Microsoft.AspNetCore.SignalR;

namespace Filmograf.SearchService.Services;

public class SearchService
{
    
    private readonly MovieRepository _movieRepository;
    private readonly CollectionRepository _collectionRepository;
    private readonly CollectionTagProvider _tagProvider; 
    private readonly GenreProvider _genreProvider; 
    private readonly SearchParsingService _searchParsingService;

    
    public SearchService(MovieRepository movieRepository, CollectionRepository collectionRepository, CollectionTagProvider tagProvider, 
        GenreProvider genreProvider, SearchParsingService searchParsingService)
    {
        _movieRepository = movieRepository;
        _collectionRepository = collectionRepository;
        _tagProvider = tagProvider;
        _genreProvider = genreProvider;
        _searchParsingService = searchParsingService;
    }

    private async Task HandleSearchParsingAsync(string query, string roomId)
    {
        await _searchParsingService.ParseSearchAsync(query, roomId);
    }
    
    public async Task<SearchPartResponseDto> SearchFilmAsync(string query, string? roomId, MovieSearchRequestDto? filters = null)
    {
        if (roomId != null) await HandleSearchParsingAsync(query, roomId);
        
        if (string.IsNullOrWhiteSpace(query))
            return new SearchPartResponseDto { Type = SearchPartType.Movie, EntityIds = Array.Empty<string>() };

        List<MovieRepo> movies;

        if (filters?.Genres != null)
        {
            movies = await _movieRepository.GetByNameWithFiltersAsync(
                query,
                filters.Genres.IncludeIds,
                filters.Genres.ExcludeIds,
                filters.StrictMatch);
        }
        else
        {
            movies = await _movieRepository.GetByNameAsync(query);
        }

        var sortedMovies = movies.SortByQuery(query, m => m.Name, m => m.Id);
        return new SearchPartResponseDto { Type = SearchPartType.Movie, EntityIds = sortedMovies };
    }
    
    public async Task<SearchPartResponseDto> SearchCollectionAsync(string query, CollectionSearchRequestDto? filters = null)
    {
        if (string.IsNullOrWhiteSpace(query))
            return new SearchPartResponseDto { Type = SearchPartType.Collection, EntityIds = Array.Empty<string>() };

        List<CollectionRepo> collections;

        if (filters != null)
        {
            collections = await _collectionRepository.GetByNameWithFiltersAsync(
                query,
                filters.Genres?.IncludeIds,
                filters.Genres?.ExcludeIds,
                filters.Tags?.IncludeIds,
                filters.Tags?.ExcludeIds,
                filters.StrictMatch);
        }
        else
        {
            collections = await _collectionRepository.GetByNameAsync(query);
        }

        var sortedCollections = collections.SortByQuery(query, m => m.Name, m => m.Id);
        return new SearchPartResponseDto { Type = SearchPartType.Collection, EntityIds = sortedCollections };
    }
    
    public async Task<SearchPartResponseDto> SearchTagAsync(string query)
    {
        if (string.IsNullOrWhiteSpace(query))
            return new SearchPartResponseDto { Type = SearchPartType.Tag, EntityIds = Array.Empty<string>() };
        
        var tags = await _tagProvider.SearchAllByNameAsync(query);
        var sortedTags = tags.SortByQuery(query, t => t.Name, t => t.Id.ToString());
        
        return new SearchPartResponseDto { Type = SearchPartType.Tag, EntityIds = sortedTags };
    }
    
    public async Task<SearchPartResponseDto> SearchGenreAsync(string query)
    {
        if (string.IsNullOrWhiteSpace(query))
            return new SearchPartResponseDto { Type = SearchPartType.Genre, EntityIds = Array.Empty<string>() };
        
        var genres = await _genreProvider.SearchAllByNameAsync(query);
        var sortedGenres = genres.SortByQuery(query, t => t.Name, t => t.Id.ToString());
        
        return new SearchPartResponseDto { Type = SearchPartType.Genre, EntityIds = sortedGenres };
    }

    
}