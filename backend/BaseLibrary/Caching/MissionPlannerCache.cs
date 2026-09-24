using Filmograf.BaseLibrary.Models.Types;
using Filmograf.BaseLibrary.Util;
using StackExchange.Redis;

namespace Filmograf.BaseLibrary.Caching;

public class MissionPlannerCache
{
    protected static readonly TimeSpan LastExpirationTime = new TimeSpan(2, 0, 0);
    protected static readonly TimeSpan TaskExpirationTime = new TimeSpan(0, 10, 0);
    protected readonly IConnectionMultiplexer _redis;
    protected readonly CachingProviderAtomic<MissionTaskCache> _cachingLastAtomic;
    protected readonly CachingProviderAtomic<MissionTaskCache> _cachingTaskAtomic;

    public MissionPlannerCache(IConnectionMultiplexer redis)
    {
        _redis = redis;
        _cachingLastAtomic = new CachingProviderAtomic<MissionTaskCache>(redis, $"mission-planner:last");
        _cachingTaskAtomic = new CachingProviderAtomic<MissionTaskCache>(redis, $"mission-planner:task");
    }
    
    private string MakeLastIdKey(string taskType)
    {
        var ipHash = HashUtil.HashSHA256(taskType);
        return _cachingLastAtomic.MakeIdKey(ipHash);
    }

    public virtual async Task SetLastAsync(string taskType, MissionTaskCache item)
    {
        var key = MakeLastIdKey(taskType);
        await _cachingLastAtomic.CreateAsync(key, item, LastExpirationTime);
    }
    
    public virtual async Task<MissionTaskCache?> GetLastAsync(string taskType)
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

    public virtual async Task SetTaskAsync(string taskType, MissionTaskCache item)
    {
        var key = MakeTaskIdKey(taskType);
        await _cachingTaskAtomic.CreateAsync(key, item, TaskExpirationTime);
    }
    
    public virtual async Task<MissionTaskCache?> GetTaskAsync(string taskType)
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