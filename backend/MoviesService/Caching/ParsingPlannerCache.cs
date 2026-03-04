using Filmograf.BaseLibrary.Caching;
using Filmograf.BaseLibrary.Util;
using Filmograf.MoviesService.Models.Types;
using StackExchange.Redis;

namespace Filmograf.MoviesService.Caching;

public class ParsingPlannerCache
{
    protected static readonly TimeSpan LastParsingExpirationTime = new TimeSpan(2, 0, 0);
    protected static readonly TimeSpan ParsingTaskExpirationTime = new TimeSpan(0, 10, 0);
    protected readonly IConnectionMultiplexer _redis;
    protected readonly CachingProviderAtomic<ParsingTaskCache> _cachingLastAtomic;
    protected readonly CachingProviderAtomic<ParsingTaskCache> _cachingTaskAtomic;

    public ParsingPlannerCache(IConnectionMultiplexer redis)
    {
        _redis = redis;
        _cachingLastAtomic = new CachingProviderAtomic<ParsingTaskCache>(redis, $"parsing-planner:last");
        _cachingTaskAtomic = new CachingProviderAtomic<ParsingTaskCache>(redis, $"parsing-planner:task");
    }
    
    private string MakeLastIdKey(string taskType)
    {
        var ipHash = HashUtil.HashSHA256(taskType);
        return _cachingLastAtomic.MakeIdKey(ipHash);
    }

    public virtual async Task SetLastAsync(string taskType, ParsingTaskCache item)
    {
        var key = MakeLastIdKey(taskType);
        await _cachingLastAtomic.CreateAsync(key, item, LastParsingExpirationTime);
    }
    
    public virtual async Task<ParsingTaskCache?> GetLastAsync(string taskType)
    {
        var key = MakeLastIdKey(taskType);
        return await _cachingLastAtomic.GetOrDefaultAsync(key);
    }

    public async Task<bool> RemoveLastAsync(string taskType)
    {
        var key = MakeLastIdKey(taskType);
        return await _cachingLastAtomic.RemoveAsync(key);
    }
    
    
    private string MakeTaskIdKey(string taskType)
    {
        var ipHash = HashUtil.HashSHA256(taskType);
        return _cachingTaskAtomic.MakeIdKey(ipHash);
    }

    public virtual async Task SetTaskAsync(string taskType, ParsingTaskCache item)
    {
        var key = MakeTaskIdKey(taskType);
        await _cachingTaskAtomic.CreateAsync(key, item, ParsingTaskExpirationTime);
    }
    
    public virtual async Task<ParsingTaskCache?> GetTaskAsync(string taskType)
    {
        var key = MakeTaskIdKey(taskType);
        return await _cachingTaskAtomic.GetOrDefaultAsync(key);
    }

    public async Task<bool> RemoveTaskAsync(string taskType)
    {
        var key = MakeTaskIdKey(taskType);
        return await _cachingTaskAtomic.RemoveAsync(key);
    }
}