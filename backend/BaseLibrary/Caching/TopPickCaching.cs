using Filmograf.BaseLibrary.Models.Dto;
using StackExchange.Redis;

namespace Filmograf.BaseLibrary.Caching;

public class TopPickCaching
{
    protected static readonly TimeSpan DefaultExpirationTime = new TimeSpan(0, 45, 0);
    protected readonly IConnectionMultiplexer _redis;
    protected readonly CachingProviderAtomic<EntitiesListResponseDto> _cachingTopPickAtomic;
    
    public TopPickCaching(IConnectionMultiplexer redis)
    {
        _redis = redis;
        _cachingTopPickAtomic = new CachingProviderAtomic<EntitiesListResponseDto>(redis, $"top-picks");
    }

    private string MakeTopPickKey(string topPickName, PaginationQueryDto pagination)
    {
        var paginationHash = pagination.ToString();
        return _cachingTopPickAtomic.MakeIdKey($"{topPickName}:{paginationHash}");
    }
    
    public virtual async Task<EntitiesListResponseDto> CachingTopPickAsync(string topPickName, PaginationQueryDto pagination, 
        Func<Task<EntitiesListResponseDto>> createItem)
    {
        var key = MakeTopPickKey(topPickName, pagination);
        return await _cachingTopPickAtomic.GetOrCreateAsync(key, createItem, DefaultExpirationTime);
    }

    public async Task ResetCachingTopPickAsync(string topPickName, PaginationQueryDto pagination, 
        Func<Task<EntitiesListResponseDto>> createItem)
    {
        var key = MakeTopPickKey(topPickName, pagination);
        var payloadData = await createItem();
        await _cachingTopPickAtomic.CreateAsync(key, payloadData, DefaultExpirationTime);
    }

    public async Task<bool> RemoveCachingTopPickAsync(string topPickName, PaginationQueryDto pagination)
    {
        var key = MakeTopPickKey(topPickName, pagination);
        return await _cachingTopPickAtomic.RemoveAsync(key);
    }

    public async Task<long> RemoveCachingTopPickRootAsync(string topPickName)
    {
        var topPickTempSpecificAtomic = new CachingProviderAtomic<EntitiesListResponseDto>(
            _redis, 
            $"top-picks:{topPickName}"
        );
        
        return await topPickTempSpecificAtomic.RemoveByRootAsync();
    }
}