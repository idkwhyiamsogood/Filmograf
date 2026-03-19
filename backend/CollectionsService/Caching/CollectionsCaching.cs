using Filmograf.BaseLibrary.Caching;
using Filmograf.BaseLibrary.Models.Dto;
using Filmograf.CollectionsService.Models.Dto;
using StackExchange.Redis;

namespace Filmograf.CollectionsService.Caching;

public class CollectionsCaching
{
    protected static readonly TimeSpan DefaultExpirationTime = new TimeSpan(0, 45, 0);
    protected readonly CachingProviderAtomic<CollectionResponseDto> _cachingAtomic;
    protected readonly CachingProviderAtomic<CollectionsBatchDto> _cachingByUserAtomic;
    protected readonly IConnectionMultiplexer _redis;
    protected readonly string _baseKey = "collections";

    public CollectionsCaching(IConnectionMultiplexer redis)
    {
        _redis = redis;
        _cachingAtomic = new CachingProviderAtomic<CollectionResponseDto>(redis, $"{_baseKey}");
        _cachingByUserAtomic = new CachingProviderAtomic<CollectionsBatchDto>(redis, $"{_baseKey}:byUser");
    }

    private string MakeKey(string id)
    {
        return _cachingAtomic.MakeIdKey($"{id}");
    }

    public virtual async Task<CollectionResponseDto> CachingAsync(string id,
        Func<Task<CollectionResponseDto>> createItem)
    {
        var key = MakeKey(id);
        return await _cachingAtomic.GetOrCreateAsync(key, createItem, DefaultExpirationTime);
    }

    public async Task ResetCachingAsync(string id,
        Func<Task<CollectionResponseDto>> createItem)
    {
        var key = MakeKey(id);
        var payloadData = await createItem();
        await _cachingAtomic.CreateAsync(key, payloadData, DefaultExpirationTime);
    }

    public async Task<bool> RemoveCachingAsync(string id)
    {
        var key = MakeKey(id);
        return await _cachingAtomic.RemoveAsync(key);
    }

    
    private string MakeUserKey(Guid userId, PaginationQueryDto pagination)
    {
        var paginationHash = pagination.ToString();
        return _cachingByUserAtomic.MakeIdKey($"{userId.ToString()}:{paginationHash}");
    }

    public virtual async Task<CollectionsBatchDto> CachingByUserAsync(Guid userId, PaginationQueryDto pagination,
        Func<Task<CollectionsBatchDto>> createItem)
    {
        var key = MakeUserKey(userId, pagination);
        return await _cachingByUserAtomic.GetOrCreateAsync(key, createItem, DefaultExpirationTime);
    }

    public async Task ResetCachingByUserAsync(Guid userId, PaginationQueryDto pagination,
        Func<Task<CollectionsBatchDto>> createItem)
    {
        var key = MakeUserKey(userId, pagination);
        var payloadData = await createItem();
        await _cachingByUserAtomic.CreateAsync(key, payloadData, DefaultExpirationTime);
    }

    public async Task<bool> RemoveCachingByUserAsync(Guid userId, PaginationQueryDto pagination)
    {
        var key = MakeUserKey(userId, pagination);
        return await _cachingByUserAtomic.RemoveAsync(key);
    }

    public async Task<long> RemoveCachingByUserRootAsync(Guid userId)
    {
        var tempSpecificAtomic = new CachingProviderAtomic<CollectionsBatchDto>(
            _redis, 
            $"{_baseKey}:byUser:{userId.ToString()}"
        );
        
        return await tempSpecificAtomic.RemoveByRootAsync();
    }
    
}