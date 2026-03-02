using Filmograf.BaseLibrary.Caching;
using Filmograf.MoviesService.Models.Types;
using StackExchange.Redis;

namespace Filmograf.MoviesService.Caching;

public class GoogleO2IdempotenceCaching : CachingProviderBase<GoogleO2Idempotence>
{
    protected static readonly TimeSpan ExpirationTime = new TimeSpan(0, 5, 0);
    
    public GoogleO2IdempotenceCaching(IConnectionMultiplexer redis) : base(redis, "google-idempotence")
    {
    }
    
    public virtual async Task SetByCodeAsync(string code, GoogleO2Idempotence item)
    {
        var key = _cachingAtomic.MakeIdKey(code);
        await _cachingAtomic.CreateAsync(key, item, ExpirationTime);
    }
    
    public virtual async Task<GoogleO2Idempotence?> GetByCodeAsync(string code)
    {
        var key = _cachingAtomic.MakeIdKey(code);
        return await _cachingAtomic.GetOrDefaultAsync(key);
    }

    public async Task<bool> RemoveByCodeAsync(string code)
    {
        var key = _cachingAtomic.MakeIdKey(code);
        return await _cachingAtomic.RemoveAsync(key);
    }
}