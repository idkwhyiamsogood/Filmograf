using Filmograf.BaseLibrary.Caching;
using Filmograf.CollectionsService.Models.Dto;
using StackExchange.Redis;

namespace Filmograf.CollectionsService.Caching;

public class CollectionPinsCaching
{
    protected static readonly TimeSpan DefaultExpirationTime = new TimeSpan(0, 45, 0);
    protected readonly CachingProviderAtomic<CollectionPinsResponseDto> _cachingByUserAtomic;
    protected readonly IConnectionMultiplexer _redis;
    protected readonly string _baseKey = "collection-pins";
    
    public CollectionPinsCaching(IConnectionMultiplexer redis)
    {
        _redis = redis;
        _cachingByUserAtomic = new CachingProviderAtomic<CollectionPinsResponseDto>(redis, $"{_baseKey}:byUser");
    }
    
    private string MakeKey(Guid userId)
    {
        return _cachingByUserAtomic.MakeIdKey($"{userId.ToString()}");
    }
    
    public virtual async Task<CollectionPinsResponseDto> CachingByUserAsync(Guid userId, 
        Func<Task<CollectionPinsResponseDto>> createItem)
    {
        var key = MakeKey(userId);
        return await _cachingByUserAtomic.GetOrCreateAsync(key, createItem, DefaultExpirationTime);
    }

    public async Task ResetCachingByUserAsync(Guid userId, 
        Func<Task<CollectionPinsResponseDto>> createItem)
    {
        var key = MakeKey(userId);
        var payloadData = await createItem();
        await _cachingByUserAtomic.CreateAsync(key, payloadData, DefaultExpirationTime);
    }

    public async Task<bool> RemoveCachingByUserAsync(Guid userId)
    {
        var key = MakeKey(userId);
        return await _cachingByUserAtomic.RemoveAsync(key);
    }
}