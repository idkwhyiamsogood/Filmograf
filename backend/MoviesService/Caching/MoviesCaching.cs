using Filmograf.BaseLibrary.Caching;
using Filmograf.BaseLibrary.Models.Dto;
using Filmograf.MoviesService.Models.Dto;
using StackExchange.Redis;

namespace Filmograf.MoviesService.Caching;

public class MoviesCaching : CachingProviderBase<MovieResponseDto>
{
    protected readonly CachingProviderAtomic<MoviesListResponseDto> _cachingTopPickAtomic;
    
    public MoviesCaching(IConnectionMultiplexer redis) : base(redis, "movies")
    {
        _cachingTopPickAtomic = new CachingProviderAtomic<MoviesListResponseDto>(redis, $"{_baseKey}:top-pick");
    }

    private string MakeTopPickKey(string topPickName, PaginationQueryDto pagination)
    {
        var paginationHash = pagination.ToString();
        return _cachingTopPickAtomic.MakeIdKey($"{topPickName}:{paginationHash}");
    }
    
    public virtual async Task<MoviesListResponseDto> CachingTopPickAsync(string topPickName, PaginationQueryDto pagination, 
        Func<Task<MoviesListResponseDto>> createItem)
    {
        var key = MakeTopPickKey(topPickName, pagination);
        return await _cachingTopPickAtomic.GetOrCreateAsync(key, createItem, DefaultExpirationTime);
    }

    public async Task ResetCachingTopPickAsync(string topPickName, PaginationQueryDto pagination, 
        Func<Task<MoviesListResponseDto>> createItem)
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
        var topPickTempSpecificAtomic = new CachingProviderAtomic<MoviesListResponseDto>(
            _redis, 
            $"movies:top-pick:{topPickName}"
        );
        
        return await topPickTempSpecificAtomic.RemoveByRootAsync();
    }
}