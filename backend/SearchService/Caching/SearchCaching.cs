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
    protected readonly CachingProviderAtomic<SearchPartResponseDto> _cachingSearchingTagsAtomic;
    protected readonly CachingProviderAtomic<SearchPartResponseDto> _cachingSearchingGenresAtomic;
    
    public SearchCaching(IConnectionMultiplexer redis)
    {
        _redis = redis;
        _cachingSearchingCollectionAtomic = new CachingProviderAtomic<SearchPartResponseDto>(redis, $"searching:collections");
        _cachingSearchingMoviesAtomic = new CachingProviderAtomic<SearchPartResponseDto>(redis, $"searching:movies");
        _cachingSearchingTagsAtomic = new CachingProviderAtomic<SearchPartResponseDto>(redis, "searching:tags");
        _cachingSearchingGenresAtomic = new CachingProviderAtomic<SearchPartResponseDto>(redis, "searching:genres");
    }

// --- COLLECTIONS ---
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
    
    
// --- MOVIES ---
    private string MakeSearchingMoviesKey(string query, PaginationQueryDto pagination, MovieSearchRequestDto? searchProps,
        bool allowFuzziness)
    {
        var searchPropsObject = new
        { searchProps, allowFuzziness };
        
        var queryHash = HashUtil.HashSHA256(query);
        var searchPropsHash = searchProps == null ? "none" : HashUtil.HashObjectSHA256(searchPropsObject);
        var paginationHash = pagination.ToString();
        
        return _cachingSearchingMoviesAtomic.MakeIdKey($"{queryHash}:{searchPropsHash}:{paginationHash}");
    }
    
    public virtual async Task<SearchPartResponseDto> CachingSearchingMoviesAsync(string query, MovieSearchRequestDto? searchProps, 
        bool allowFuzziness, PaginationQueryDto pagination, Func<Task<SearchPartResponseDto>> createItem)
    {
        var key = MakeSearchingMoviesKey(query, pagination, searchProps, allowFuzziness);
        return await _cachingSearchingMoviesAtomic.GetOrCreateAsync(key, createItem, DefaultExpirationTime);
    }

    public async Task ResetCachingSearchingMoviesAsync(string query, MovieSearchRequestDto? searchProps, bool allowFuzziness, 
        PaginationQueryDto pagination, Func<Task<SearchPartResponseDto>> createItem)
    {
        var key = MakeSearchingMoviesKey(query, pagination, searchProps, allowFuzziness);
        var payloadData = await createItem();
        await _cachingSearchingMoviesAtomic.CreateAsync(key, payloadData, DefaultExpirationTime);
    }

    public async Task<bool> RemoveCachingSearchingMoviesAsync(string query, MovieSearchRequestDto? searchProps, bool allowFuzziness, 
        PaginationQueryDto pagination)
    {
        var key = MakeSearchingMoviesKey(query, pagination, searchProps, allowFuzziness);
        return await _cachingSearchingMoviesAtomic.RemoveAsync(key);
    }
    
    
// --- TAGS ---
    private string MakeSearchingTagsKey(string query, PaginationQueryDto pagination)
    {
        var queryHash = HashUtil.HashSHA256(query);
        var paginationHash = pagination.ToString();
        return _cachingSearchingTagsAtomic.MakeIdKey($"{queryHash}:{paginationHash}");
    }

    public virtual async Task<SearchPartResponseDto> CachingSearchingTagsAsync(
        string query, PaginationQueryDto pagination, Func<Task<SearchPartResponseDto>> createItem)
    {
        var key = MakeSearchingTagsKey(query, pagination);
        return await _cachingSearchingTagsAtomic.GetOrCreateAsync(key, createItem, DefaultExpirationTime);
    }

    public async Task<bool> RemoveCachingSearchingTagsAsync(string query, PaginationQueryDto pagination)
    {
        var key = MakeSearchingTagsKey(query, pagination);
        return await _cachingSearchingTagsAtomic.RemoveAsync(key);
    }

    
// --- GENRES ---
    private string MakeSearchingGenresKey(string query, PaginationQueryDto pagination)
    {
        var queryHash = HashUtil.HashSHA256(query);
        var paginationHash = pagination.ToString();
        return _cachingSearchingGenresAtomic.MakeIdKey($"{queryHash}:{paginationHash}");
    }

    public virtual async Task<SearchPartResponseDto> CachingSearchingGenresAsync(
        string query, PaginationQueryDto pagination, Func<Task<SearchPartResponseDto>> createItem)
    {
        var key = MakeSearchingGenresKey(query, pagination);
        return await _cachingSearchingGenresAtomic.GetOrCreateAsync(key, createItem, DefaultExpirationTime);
    }

    public async Task<bool> RemoveCachingSearchingGenresAsync(string query, PaginationQueryDto pagination)
    {
        var key = MakeSearchingGenresKey(query, pagination);
        return await _cachingSearchingGenresAtomic.RemoveAsync(key);
    }
    
}