using Filmograf.BaseLibrary.Models.Types;
using StackExchange.Redis;

namespace Filmograf.BaseLibrary.Caching;

public class DeferredQueuePickCaching
{
    protected readonly CachingProviderAtomic<DeferredQueuePickCache> _cachingAtomic;
    protected readonly IConnectionMultiplexer _redis;
    protected readonly string _baseKey = "deferred-queue-picks";

    public DeferredQueuePickCaching(IConnectionMultiplexer redis)
    {
        _redis = redis;
        _cachingAtomic = new CachingProviderAtomic<DeferredQueuePickCache>(redis, $"{_baseKey}");
    }

    private string MakeKey(string queueType, string entityId)
    {
        return _cachingAtomic.MakeIdKey($"{queueType}:{entityId}");
    }

    public async Task<DeferredQueuePickCache?> GetOrDefaultAsync(string queueType, string entityId)
    {
        var key = MakeKey(queueType, entityId);
        return await _cachingAtomic.GetOrDefaultAsync(key);
    }

    public async Task SetAsync(string queueType, string entityId)
    {
        var key = MakeKey(queueType, entityId);
        var pick = new DeferredQueuePickCache();
        await _cachingAtomic.CreateAsync(key, pick);
    }

    public async Task<bool> DeleteAsync(string queueType, string entityId)
    {
        var key = MakeKey(queueType, entityId);
        return await _cachingAtomic.RemoveAsync(key);
    }

    public async Task<long> DeleteByRootAsync(string queueType)
    {
        var tempSpecificAtomic = new CachingProviderAtomic<DeferredQueuePickCache>(
            _redis, $"{_baseKey}:{queueType}"
        );
        
        return await tempSpecificAtomic.RemoveByRootAsync();
    }
    
    public async Task<List<string>> PullMovieIdsAsync(string queueType)
    {
        var endpoints = _redis.GetEndPoints();
        var server = _redis.GetServer(endpoints[0]);
        var db = _redis.GetDatabase();
    
        var pattern = $"{_baseKey}:{queueType}:*";
        var keys = new List<RedisKey>();
        var entityIds = new List<string>();

        // находим все ключи по паттерну
        await foreach (var key in server.KeysAsync(db.Database, pattern))
        {
            keys.Add(key);
        
            // извлекаем ID. если ключ "movie-index-picks:{XXX}", 
            // то берем всё, что после последнего двоеточия.
            var keyString = key.ToString();
            var id = keyString.Substring(keyString.LastIndexOf(':') + 1);
            entityIds.Add(id);
        }

        if (keys.Count > 0)
        {
            // удаляем именно те ключи, которые мы прочитали
            // это важно, ибо если за время обработки прилетел новый Pick, 
            // мы его не удалим, так как его ID не было в списке keys.
            await db.KeyDeleteAsync(keys.ToArray());
        }

        return entityIds;
    }
}