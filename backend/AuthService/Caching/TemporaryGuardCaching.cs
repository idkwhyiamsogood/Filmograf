using System.Security.Cryptography;
using System.Text;
using Filmograf.BaseLibrary.Caching;
using Filmograf.BaseLibrary.Util;
using Filmograf.MoviesService.Models.Types;
using StackExchange.Redis;

namespace Filmograf.MoviesService.Caching;

public class TemporaryGuardCaching
{
    protected static readonly TimeSpan ExpirationTime = new TimeSpan(0, 5, 0);
    protected readonly IConnectionMultiplexer _redis;
    protected readonly CachingProviderAtomic<TemporaryAuthGuardItem> _cachingAtomic;
    
    public TemporaryGuardCaching(IConnectionMultiplexer redis)
    {
        _redis = redis;
        _cachingAtomic = new CachingProviderAtomic<TemporaryAuthGuardItem>(redis, $"temporary-auth-guard:byId");
    }

    private string MakeIdKey(string ip, string userAgent)
    {
        var ipHash = HashUtil.HashSHA256(ip);
        var userAgentHash = HashUtil.HashSHA256(userAgent);
        
        return _cachingAtomic.MakeIdKey($"{ipHash}-{userAgentHash}");
    }

    public virtual async Task SetAsync(string ip, string userAgent, TemporaryAuthGuardItem item)
    {
        var key = MakeIdKey(ip, userAgent);
        await _cachingAtomic.CreateAsync(key, item, ExpirationTime);
    }
    
    public virtual async Task<TemporaryAuthGuardItem?> GetAsync(string ip, string userAgent)
    {
        var key = MakeIdKey(ip, userAgent);
        return await _cachingAtomic.GetOrDefaultAsync(key);
    }

    public async Task<bool> RemoveAsync(string ip, string userAgent)
    {
        var key = MakeIdKey(ip, userAgent);
        return await _cachingAtomic.RemoveAsync(key);
    }
}