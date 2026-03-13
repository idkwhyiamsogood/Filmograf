using Filmograf.BaseLibrary.Caching;
using Filmograf.BaseLibrary.Models.Dto;
using Filmograf.CollectionsService.Models.Dto;
using StackExchange.Redis;

namespace Filmograf.CollectionsService.Caching;

public class CollectionTagsCaching
{
    protected static readonly TimeSpan DefaultExpirationTime = new TimeSpan(0, 45, 0);
    protected readonly CachingProviderAtomic<IEnumerable<CollectionTagResponseDto>> _cachingAllAtomic;
    protected readonly IConnectionMultiplexer _redis;
    protected readonly string _baseKey = "collection-tags";
    
    public CollectionTagsCaching(IConnectionMultiplexer redis)
    {
        _redis = redis;
        _cachingAllAtomic = new CachingProviderAtomic<IEnumerable<CollectionTagResponseDto>>(redis, $"{_baseKey}");
    }
    
    private string MakeKey(PaginationQueryDto pagination)
    {
        var paginationHash = pagination.ToString();
        return _cachingAllAtomic.MakeIdKey($"{paginationHash}");
    }
    
    public virtual async Task<IEnumerable<CollectionTagResponseDto>> CachingAllAsync(PaginationQueryDto pagination, 
        Func<Task<IEnumerable<CollectionTagResponseDto>>> createItem)
    {
        var key = MakeKey(pagination);
        return await _cachingAllAtomic.GetOrCreateAsync(key, createItem, DefaultExpirationTime);
    }

    public async Task ResetCachingAllAsync(PaginationQueryDto pagination, 
        Func<Task<IEnumerable<CollectionTagResponseDto>>> createItem)
    {
        var key = MakeKey(pagination);
        var payloadData = await createItem();
        await _cachingAllAtomic.CreateAsync(key, payloadData, DefaultExpirationTime);
    }

    public async Task<bool> RemoveCachingAllAsync(PaginationQueryDto pagination)
    {
        var key = MakeKey(pagination);
        return await _cachingAllAtomic.RemoveAsync(key);
    }

    public async Task RemoveCachingByRootAsync()
    {
        await _cachingAllAtomic.RemoveByRootAsync();
    }
}