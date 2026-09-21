using Filmograf.BaseLibrary.Models.Types;
using StackExchange.Redis;

namespace Filmograf.BaseLibrary.Caching;

public abstract class CachingProviderBase<BType> 
    where BType : class
{
    protected static readonly TimeSpan DefaultExpirationTime = new TimeSpan(0, 45, 0);

    protected readonly IConnectionMultiplexer _redis;
    protected readonly CachingProviderAtomic<BType> _cachingAtomic;
    protected readonly CachingProviderAtomic<IEnumerable<BType>> _enumerableCachingAtomic;
    protected readonly string _baseKey;

    public CachingProviderBase(IConnectionMultiplexer redis, string baseKey)
    {
        _redis = redis;
        _baseKey = baseKey;

        _cachingAtomic = new CachingProviderAtomic<BType>(redis, $"{baseKey}:byId");
        _enumerableCachingAtomic = new CachingProviderAtomic<IEnumerable<BType>>(redis, $"{baseKey}");
    }
    
    public virtual async Task<BType> CachingAsync(string id, Func<Task<BType>> createItem)
    {
        var key = _cachingAtomic.MakeIdKey(id);
        return await _cachingAtomic.GetOrCreateAsync(key, createItem, DefaultExpirationTime);
    }
    
    public virtual async Task<BType> CachingAsync(Guid id, Func<Task<BType>> createItem)
    {
        return await _cachingAtomic.GetOrCreateAsync(id, createItem, DefaultExpirationTime);
    }
    
    public async Task ResetCachingAsync(Guid id, Func<Task<BType>> createItem)
    {
        var payloadData = await createItem();
        await _cachingAtomic.CreateAsync(id, payloadData, DefaultExpirationTime);
    }
    
    public async Task<bool> RemoveCachingAsync(string id)
    {
        var key = _cachingAtomic.MakeIdKey(id);
        return await _cachingAtomic.RemoveAsync(key);
    }

    public async Task<bool> RemoveCachingAsync(Guid id)
    {
        return await _cachingAtomic.RemoveAsync(id);
    }
    
    
    public virtual async Task<IEnumerable<BType>> CachingAllAsync(Func<Task<IEnumerable<BType>>> createItem)
    {
        return await _enumerableCachingAtomic.GetOrCreateAsync(0, createItem, DefaultExpirationTime);
    }
    
    public async Task ResetCachingAllAsync(Func<Task<IEnumerable<BType>>> createItem)
    {
        var payloadData = await createItem();
        await _enumerableCachingAtomic.CreateAsync(0, payloadData, DefaultExpirationTime);
    }

    public async Task<bool> RemoveCachingAllAsync()
    {
        return await _enumerableCachingAtomic.RemoveAsync(0);
    }
}