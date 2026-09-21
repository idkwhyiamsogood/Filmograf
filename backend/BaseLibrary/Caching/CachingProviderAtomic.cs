using System.Text.Json;
using StackExchange.Redis;

namespace Filmograf.BaseLibrary.Caching;

public class CachingProviderAtomic<BType> where BType : class
{
    protected readonly IConnectionMultiplexer _redis;
    protected readonly IDatabase _redisDb;
    protected readonly string _idKey;

    public CachingProviderAtomic(IConnectionMultiplexer redis, string idKey)
    {
        _redis = redis;
        _redisDb = _redis.GetDatabase();
        _idKey = idKey;
    }

    public virtual string MakeIdKey(int id) => $"{_idKey}:{id}";
    public virtual string MakeIdKey(string subKey) => $"{_idKey}:{subKey}";
    
    public virtual async Task<BType?> GetOrDefaultAsync(Guid uuid) => 
        await GetOrDefaultAsync(MakeIdKey(uuid.ToString()));
    
    public virtual async Task<BType?> GetOrDefaultAsync(int id) => 
        await GetOrDefaultAsync(MakeIdKey(id));
    

    public virtual async Task<BType?> GetOrDefaultAsync(string key)
    {
        try
        {
            var cachedValue = await _redisDb.StringGetAsync(key);

            if (!cachedValue.IsNullOrEmpty)
                return JsonSerializer.Deserialize<BType>(cachedValue);

            return null;
        }
        catch (Exception ex)
        {
            return null;
        }
    }
    
    public virtual async Task<BType> GetOrCreateAsync(int id, BType newItem, TimeSpan? expirationTime = null) =>
        await this.GetOrCreateAsync(MakeIdKey(id), async () => newItem, expirationTime);
    
    public virtual async Task<BType> GetOrCreateAsync(Guid uuid, BType newItem, TimeSpan? expirationTime = null) =>
        await this.GetOrCreateAsync(MakeIdKey(uuid.ToString()), async () => newItem, expirationTime);

    public virtual async Task<BType> GetOrCreateAsync(int id, Func<Task<BType>> createItem, TimeSpan? expirationTime = null) =>
        await this.GetOrCreateAsync(MakeIdKey(id), createItem, expirationTime);

    public virtual async Task<BType> GetOrCreateAsync(Guid uuid, Func<Task<BType>> createItem, TimeSpan? expirationTime = null) =>
        await this.GetOrCreateAsync(MakeIdKey(uuid.ToString()), createItem, expirationTime);
    
    public virtual async Task<BType> GetOrCreateAsync(string key, Func<Task<BType>> createItem, TimeSpan? expirationTime = null)
    {
        try
        {
            var cachedValue = await _redisDb.StringGetAsync(key);

            if (!cachedValue.IsNullOrEmpty)
                return JsonSerializer.Deserialize<BType>(cachedValue);

            var newValue = await createItem();
            var newCachedValue = JsonSerializer.Serialize(newValue);
            await _redisDb.StringSetAsync(key, newCachedValue, expirationTime);

            return newValue;
        }
        catch (Exception ex)
        {
            return await createItem();
        }
    }
    
    public virtual async Task CreateAsync(Guid uuid, BType newItem, TimeSpan? expirationTime = null) => 
        await this.CreateAsync(MakeIdKey(uuid.ToString()), newItem, expirationTime);
    
    public virtual async Task CreateAsync(int id, BType newItem, TimeSpan? expirationTime = null) => 
        await this.CreateAsync(MakeIdKey(id), newItem, expirationTime);

    public virtual async Task CreateAsync(string key, BType newItem, TimeSpan? expirationTime = null)
    {
        try
        {
            var newCachedValue = JsonSerializer.Serialize(newItem);
            await _redisDb.StringSetAsync(key, newCachedValue, expirationTime);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
        }
    }

    
    public virtual async Task<bool> RemoveAsync(Guid uuid) => 
        await this.RemoveAsync(MakeIdKey(uuid.ToString()));
    
    public virtual async Task<bool> RemoveAsync(int id) => 
        await this.RemoveAsync(MakeIdKey(id));
    
    public virtual async Task<bool> RemoveAsync(string key)
    {
        try
        {
            return await _redisDb.KeyDeleteAsync(key);
        }
        catch (Exception ex)
        {
            return false;
        }
    }

    
    public virtual async Task<bool> ExistsAsync(Guid uuid) =>
        await this.ExistsAsync(MakeIdKey(uuid.ToString()));
    
    public virtual async Task<bool> ExistsAsync(int id) =>
        await this.ExistsAsync(MakeIdKey(id));
    
    public virtual async Task<bool> ExistsAsync(string key)
    {
        try
        {
            return await _redisDb.KeyExistsAsync(key);
        }
        catch (Exception e)
        {
            return false;
        }
    }
    
    public virtual async Task<long> RemoveByRootAsync()
    {
        try
        {
            var server = GetServer();
            if (server == null)
                return 0;

            var pattern = $"{_idKey}:*";
            var keys = new List<RedisKey>();

            await foreach (var key in server.KeysAsync(_redisDb.Database, pattern))
            { keys.Add(key); }

            if (keys.Count == 0)
                return 0;

            return await _redisDb.KeyDeleteAsync(keys.ToArray());
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return 0;
        }
    }
    
    private IServer? GetServer()
    {
        try
        {
            var endpoints = _redis.GetEndPoints();
            if (endpoints.Length == 0)
                return null;

            return _redis.GetServer(endpoints[0]);
        }
        catch
        {
            return null;
        }
    }
}