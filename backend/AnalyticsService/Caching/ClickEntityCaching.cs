using Filmograf.AnalyticsService.Models.Types;
using Filmograf.BaseLibrary.Caching;
using StackExchange.Redis;

namespace Filmograf.AnalyticsService.Caching;

public class ClickEntityCaching
{
    protected readonly CachingProviderAtomic<ClickEntityEvent> _cachingByUserAtomic;
    protected static readonly TimeSpan DefaultExpirationTime = new TimeSpan(0, 5, 0);
    protected readonly IConnectionMultiplexer _redis;
    protected readonly string _baseKey = "entity-clicks";
    
    public ClickEntityCaching(IConnectionMultiplexer redis)
    {
        _cachingByUserAtomic = new CachingProviderAtomic<ClickEntityEvent>(redis, $"{_baseKey}:byUser");
    }
    
    private string MakeUserClickKey(Guid userId, string entityType, string entityId)
    {
        return _cachingByUserAtomic.MakeIdKey($"{userId.ToString()}:{entityType}:{entityId}");
    }
    
    public virtual async Task SetUserClickAsync(Guid userId, string entityType, string entityId, ClickEntityEvent newItem)
    {
        var key = MakeUserClickKey(userId, entityType, entityId);
        await _cachingByUserAtomic.CreateAsync(key, newItem, DefaultExpirationTime);
    }
    
    public virtual async Task<ClickEntityEvent?> GetUserClickAsync(Guid userId, string entityType, string entityId)
    {
        var key = MakeUserClickKey(userId, entityType, entityId);
        return await _cachingByUserAtomic.GetOrDefaultAsync(key);
    }

    public async Task ResetCachingUserClickAsync(Guid userId, string entityType, string entityId, 
        Func<Task<ClickEntityEvent>> createItem)
    {
        var key = MakeUserClickKey(userId, entityType, entityId);
        var payloadData = await createItem();
        await _cachingByUserAtomic.CreateAsync(key, payloadData, DefaultExpirationTime);
    }

    public async Task<bool> RemoveCachingUserClickAsync(Guid userId, string entityType, string entityId)
    {
        var key = MakeUserClickKey(userId, entityType, entityId);
        return await _cachingByUserAtomic.RemoveAsync(key);
    }

    public async Task<long> RemoveCachingUserClickRootAsync(Guid userId, string entityType)
    {
        var topPickTempSpecificAtomic = new CachingProviderAtomic<ClickEntityEvent>(
            _redis, 
            $"{_baseKey}:byUser:{userId.ToString()}:{entityType}"
        );
        
        return await topPickTempSpecificAtomic.RemoveByRootAsync();
    }

    public async Task<long> RemoveCachingUserClickRootAsync(Guid userId)
    {
        var topPickTempSpecificAtomic = new CachingProviderAtomic<ClickEntityEvent>(
            _redis, 
            $"{_baseKey}:byUser:{userId.ToString()}"
        );
        
        return await topPickTempSpecificAtomic.RemoveByRootAsync();
    }
}