using Filmograf.BaseLibrary.Caching;
using Filmograf.BaseLibrary.Models.Dto;
using Filmograf.BaseLibrary.Util;
using Filmograf.SearchService.Models.Dto;
using StackExchange.Redis;

namespace Filmograf.SearchService.Caching;

public class SearchCaching
{
    protected static readonly TimeSpan DefaultExpirationTime = new TimeSpan(0, 45, 0);
    protected readonly IConnectionMultiplexer _redis;
    protected readonly CachingProviderAtomic<SearchPartResponseDto> _cachingSearchingCollectionAtomic;
    protected readonly CachingProviderAtomic<SearchPartResponseDto> _cachingSearchingMoviesAtomic;
    
    public SearchCaching(IConnectionMultiplexer redis)
    {
        _redis = redis;
        _cachingSearchingCollectionAtomic = new CachingProviderAtomic<SearchPartResponseDto>(redis, $"searching:collections");
        _cachingSearchingMoviesAtomic = new CachingProviderAtomic<SearchPartResponseDto>(redis, $"searching:movies");
    }

    private string MakeSearchingCollectionKey(string query, PaginationQueryDto pagination, CollectionSearchRequestDto? searchProps)
    {
        var queryHash = HashUtil.HashSHA256(query);
        var searchPropsHash = searchProps == null ? "none" : HashUtil.HashObjectSHA256(searchProps);
        var paginationHash = pagination.ToString();
        
        return _cachingSearchingCollectionAtomic.MakeIdKey($"{queryHash}:{searchPropsHash}:{paginationHash}");
    }
    
    public virtual async Task<SearchPartResponseDto> CachingSearchingCollectionAsync(string query, PaginationQueryDto pagination, 
        CollectionSearchRequestDto? searchProps, Func<Task<SearchPartResponseDto>> createItem)
    {
        var key = MakeSearchingCollectionKey(query, pagination, searchProps);
        return await _cachingSearchingCollectionAtomic.GetOrCreateAsync(key, createItem, DefaultExpirationTime);
    }

    public async Task ResetCachingSearchingCollectionAsync(string query, PaginationQueryDto pagination, 
        Func<Task<SearchPartResponseDto>> createItem, CollectionSearchRequestDto? searchProps)
    {
        var key = MakeSearchingCollectionKey(query, pagination, searchProps);
        var payloadData = await createItem();
        await _cachingSearchingCollectionAtomic.CreateAsync(key, payloadData, DefaultExpirationTime);
    }

    public async Task<bool> RemoveCachingSearchingCollectionAsync(string query, PaginationQueryDto pagination, CollectionSearchRequestDto? searchProps)
    {
        var key = MakeSearchingCollectionKey(query, pagination, searchProps);
        return await _cachingSearchingCollectionAtomic.RemoveAsync(key);
    }
    
    
    
    
    private string MakeSearchingMoviesKey(string query, PaginationQueryDto pagination, MovieSearchRequestDto? searchProps)
    {
        var queryHash = HashUtil.HashSHA256(query);
        var searchPropsHash = searchProps == null ? "none" : HashUtil.HashObjectSHA256(searchProps);
        var paginationHash = pagination.ToString();
        
        return _cachingSearchingMoviesAtomic.MakeIdKey($"{queryHash}:{searchPropsHash}:{paginationHash}");
    }
    
    public virtual async Task<SearchPartResponseDto> CachingSearchingMoviesAsync(string query, PaginationQueryDto pagination, 
        MovieSearchRequestDto? searchProps, Func<Task<SearchPartResponseDto>> createItem)
    {
        var key = MakeSearchingMoviesKey(query, pagination, searchProps);
        return await _cachingSearchingMoviesAtomic.GetOrCreateAsync(key, createItem, DefaultExpirationTime);
    }

    public async Task ResetCachingSearchingMoviesAsync(string query, PaginationQueryDto pagination, 
        Func<Task<SearchPartResponseDto>> createItem, MovieSearchRequestDto? searchProps)
    {
        var key = MakeSearchingMoviesKey(query, pagination, searchProps);
        var payloadData = await createItem();
        await _cachingSearchingMoviesAtomic.CreateAsync(key, payloadData, DefaultExpirationTime);
    }

    public async Task<bool> RemoveCachingSearchingMoviesAsync(string query, PaginationQueryDto pagination, MovieSearchRequestDto? searchProps)
    {
        var key = MakeSearchingMoviesKey(query, pagination, searchProps);
        return await _cachingSearchingMoviesAtomic.RemoveAsync(key);
    }
    
}