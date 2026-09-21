using System.Text.Json;
using StackExchange.Redis;

namespace Filmograf.BaseLibrary.Services;

public class RedisService
{
    private readonly IConnectionMultiplexer _redis;

    public RedisService(IConnectionMultiplexer redis)
    {
        _redis = redis;
    }

    public async Task SetAsync<T>(string key, T value, TimeSpan expiry)
    {
        var db = _redis.GetDatabase();
        var json = JsonSerializer.Serialize(value);
        await db.StringSetAsync(key, json, expiry);
    }

    public async Task<T?> GetAsync<T>(string key)
    {
        var db = _redis.GetDatabase();
        var json = await db.StringGetAsync(key);
        
        if (json.IsNullOrEmpty)
            return default;

        return JsonSerializer.Deserialize<T>(json!);
    }

    public async Task<bool> RemoveAsync(string key)
    {
        var db = _redis.GetDatabase();
        return await db.KeyDeleteAsync(key);
    }

    public async Task<bool> UpdateExpiryAsync(string key, TimeSpan expiry)
    {
        var db = _redis.GetDatabase();
        return await db.KeyExpireAsync(key, expiry);
    }
}