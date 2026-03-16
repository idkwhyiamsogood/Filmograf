using Filmograf.BaseLibrary.Caching;
using Filmograf.BaseLibrary.Models.Repo;
using Filmograf.MoviesService.Models.Dto;
using StackExchange.Redis;

namespace Filmograf.MoviesService.Caching;

public class MovieRateCaching
{
    protected readonly CachingProviderAtomic<MovieRateRepo> _cachingByUserAtomic;
    protected readonly CachingProviderAtomic<IEnumerable<MovieRateResponseDto>> _cachingAllByUserAtomic;
    protected readonly CachingProviderAtomic<IEnumerable<MovieRateResponseDto>> _cachingByMovieAtomic;
    protected static readonly TimeSpan DefaultExpirationTime = new TimeSpan(1, 0, 0);
    protected readonly IConnectionMultiplexer _redis;
    protected readonly string _baseKey = "movies-rates";

    public MovieRateCaching(IConnectionMultiplexer redis)
    {
        _cachingByUserAtomic = new CachingProviderAtomic<MovieRateRepo>(redis, $"{_baseKey}:byUser");
        _cachingAllByUserAtomic = new CachingProviderAtomic<IEnumerable<MovieRateResponseDto>>(redis, $"{_baseKey}:byUser:all");
        _cachingByMovieAtomic = new CachingProviderAtomic<IEnumerable<MovieRateResponseDto>>(redis, $"{_baseKey}:byMovie");
    }
    
    private string MakeUserMovieKey(Guid userId, string movieId)
    {
        return _cachingByUserAtomic.MakeIdKey($"{userId.ToString()}:{movieId}");
    }
    
    public virtual async Task<MovieRateRepo> CachingUserMovieAsync(Guid userId, string movieId, 
        Func<Task<MovieRateRepo>> createItem)
    {
        var key = MakeUserMovieKey(userId, movieId);
        return await _cachingByUserAtomic.GetOrCreateAsync(key, createItem, DefaultExpirationTime);
    }

    public async Task ResetCachingUserMovieAsync(Guid userId, string movieId, 
        Func<Task<MovieRateRepo>> createItem)
    {
        var key = MakeUserMovieKey(userId, movieId);
        var payloadData = await createItem();
        await _cachingByUserAtomic.CreateAsync(key, payloadData, DefaultExpirationTime);
    }

    public async Task<bool> RemoveCachingUserMovieAsync(Guid userId, string movieId)
    {
        var key = MakeUserMovieKey(userId, movieId);
        return await _cachingByUserAtomic.RemoveAsync(key);
    }

    public async Task<long> RemoveCachingUserMovieRootAsync(Guid userId)
    {
        var topPickTempSpecificAtomic = new CachingProviderAtomic<MovieResponseDto>(
            _redis, 
            $"{_baseKey}:byUser:{userId.ToString()}"
        );
        
        return await topPickTempSpecificAtomic.RemoveByRootAsync();
    }
    
    
    private string MakeUserKey(Guid userId)
    {
        return _cachingAllByUserAtomic.MakeIdKey($"{userId.ToString()}");
    }
    
    public virtual async Task<IEnumerable<MovieRateResponseDto>> CachingUserAllAsync(Guid userId, 
        Func<Task<IEnumerable<MovieRateResponseDto>>> createItem)
    {
        var key = MakeUserKey(userId);
        return await _cachingAllByUserAtomic.GetOrCreateAsync(key, createItem, DefaultExpirationTime);
    }

    public async Task ResetCachingUserAllAsync(Guid userId, 
        Func<Task<IEnumerable<MovieRateResponseDto>>> createItem)
    {
        var key = MakeUserKey(userId);
        var payloadData = await createItem();
        await _cachingAllByUserAtomic.CreateAsync(key, payloadData, DefaultExpirationTime);
    }

    public async Task<bool> RemoveCachingUserAllAsync(Guid userId)
    {
        var key = MakeUserKey(userId);
        return await _cachingAllByUserAtomic.RemoveAsync(key);
    }


    private string MakeMovieKey(string movieId)
    {
        return _cachingByMovieAtomic.MakeIdKey($"{movieId}");
    }
    
    public virtual async Task<IEnumerable<MovieRateResponseDto>> CachingByMovieAsync(string movieId, 
        Func<Task<IEnumerable<MovieRateResponseDto>>> createItem)
    {
        var key = MakeMovieKey(movieId);
        return await _cachingByMovieAtomic.GetOrCreateAsync(key, createItem, DefaultExpirationTime);
    }

    public async Task ResetCachingByMovieAsync(string movieId, 
        Func<Task<IEnumerable<MovieRateResponseDto>>> createItem)
    {
        var key = MakeMovieKey(movieId);
        var payloadData = await createItem();
        await _cachingByMovieAtomic.CreateAsync(key, payloadData, DefaultExpirationTime);
    }

    public async Task<bool> RemoveCachingByMovieAsync(string movieId)
    {
        var key = MakeMovieKey(movieId);
        return await _cachingByMovieAtomic.RemoveAsync(key);
    }
}