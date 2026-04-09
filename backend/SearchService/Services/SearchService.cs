using System.Runtime.CompilerServices;
using Filmograf.BaseLibrary.DataAccess.Providers;
using Filmograf.BaseLibrary.DataAccess.Repositories;
using Filmograf.BaseLibrary.Models.Dto;
using Filmograf.BaseLibrary.Models.Entities;
using Filmograf.BaseLibrary.Models.Repo;
using Filmograf.SearchService.Caching;
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
    private readonly SearchCaching _searchCaching;

    
    public SearchService(MovieRepository movieRepository, CollectionRepository collectionRepository, CollectionTagProvider tagProvider, 
        GenreProvider genreProvider, SearchParsingService searchParsingService, SearchCaching searchCaching)
    {
        _movieRepository = movieRepository;
        _collectionRepository = collectionRepository;
        _tagProvider = tagProvider;
        _genreProvider = genreProvider;
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

        var sortedMovies = movies.SortByQuery(query, m => m.Name, m => m.Id);
        
        var pagedIds = sortedMovies
            .Skip(pagination.Page * pagination.Count)
            .Take(pagination.Count)
            .ToArray();
        
        if (!pagedIds.Any()) return new SearchPartResponseDto();

        
        return new SearchPartResponseDto { Type = SearchPartType.Movie, EntityIds = pagedIds };
    }
    private async Task<SearchPartResponseDto> CreateCacheForSearchCollectionAsync(string query, PaginationQueryDto pagination, CollectionSearchRequestDto? filters = null)
    {
        if (string.IsNullOrWhiteSpace(query))
            return new SearchPartResponseDto { Type = SearchPartType.Collection, EntityIds = Array.Empty<string>() };

        List<CollectionRepo> collections;

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

        var sortedCollections = collections.SortByQuery(query, m => m.Name, m => m.Id);
        
        var pagedIds = sortedCollections
            .Skip(pagination.Page * pagination.Count)
            .Take(pagination.Count)
            .ToArray();
        
        if (!pagedIds.Any()) return new SearchPartResponseDto();

        
        return new SearchPartResponseDto { Type = SearchPartType.Collection, EntityIds = pagedIds };
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

        
        return new SearchPartResponseDto { Type = SearchPartType.Collection, EntityIds = pagedIds };
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
    
    

    public async Task<SearchPartResponseDto> SearchFilmAsync(string query, PaginationQueryDto pagination, string? roomId, MovieSearchRequestDto? filters = null)
    {
        if (roomId != null) await HandleSearchParsingAsync(query, roomId);
        
        var method = async () => await CreateCacheForSearchFilmAsync(query, pagination, filters);
        return await _searchCaching.CachingSearchingMoviesAsync(query, pagination, filters, method);
    }
    
    public async Task<SearchPartResponseDto> SearchCollectionAsync(string query, PaginationQueryDto pagination, string? roomId, CollectionSearchRequestDto? filters = null)
    {
        if (roomId != null) await HandleSearchParsingAsync(query, roomId);
        
        var method = async () => await CreateCacheForSearchCollectionAsync(query, pagination, filters);
        return await _searchCaching.CachingSearchingCollectionAsync(query, pagination, filters, method);
    }
    
    public async Task<SearchPartResponseDto> SearchTagAsync(string query, PaginationQueryDto pagination, string? roomId)
    {
        if (roomId != null) await HandleSearchParsingAsync(query, roomId);

        var method = async () => await CreateCacheForSearchTagAsync(query, pagination);
        return await _searchCaching.CachingSearchingTagsAsync(query, pagination, method);
    }

    public async Task<SearchPartResponseDto> SearchGenreAsync(string query, PaginationQueryDto pagination)
    {
        var method = async () => await CreateCacheForSearchGenreAsync(query, pagination);
        return await _searchCaching.CachingSearchingGenresAsync(query, pagination, method);
    }
    
}