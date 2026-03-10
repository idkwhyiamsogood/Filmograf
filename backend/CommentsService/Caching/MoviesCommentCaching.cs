using Filmograf.BaseLibrary.Caching;
using Filmograf.BaseLibrary.Models.Dto;
using Filmograf.CommentsService.Models.Dto;
using StackExchange.Redis;

namespace Filmograf.CommentsService.Caching;

public class MoviesCommentCaching
{
    protected static readonly TimeSpan DefaultExpirationTime = new TimeSpan(0, 30, 0);
    
    protected readonly CachingProviderAtomic<IEnumerable<CommentResponseDto>> _cachingAtomic;
    private readonly IConnectionMultiplexer _redis;
    
    public MoviesCommentCaching(IConnectionMultiplexer redis)
    {
        _redis = redis;
        _cachingAtomic = new CachingProviderAtomic<IEnumerable<CommentResponseDto>>(redis, $"comments:movies:v2");
    }
    
    private string MakeKey(string movieId, PaginationQueryDto pagination)
    {
        var paginationHash = pagination.ToString();
        return _cachingAtomic.MakeIdKey($"{movieId}:{paginationHash}");
    }
    
    public virtual async Task<IEnumerable<CommentResponseDto>> CachingResponseAsync(string movieId, 
        PaginationQueryDto pagination, Func<Task<IEnumerable<CommentResponseDto>>> createItem)
    {
        var key = MakeKey(movieId, pagination);
        return await _cachingAtomic.GetOrCreateAsync(key, createItem, DefaultExpirationTime);
    }

    public async Task ResetCachingResponseAsync(string movieId, PaginationQueryDto pagination, 
        Func<Task<IEnumerable<CommentResponseDto>>> createItem)
    {
        var key = MakeKey(movieId, pagination);
        var payloadData = await createItem();
        await _cachingAtomic.CreateAsync(key, payloadData, DefaultExpirationTime);
    }

    public async Task<bool> RemoveCachingResponseAsync(string movieId, PaginationQueryDto pagination)
    {
        var key = MakeKey(movieId, pagination);
        return await _cachingAtomic.RemoveAsync(key);
    }
    
    public async Task<long> RemoveCachingMovieRootAsync(string movieId)
    {
        var topPickTempSpecificAtomic = new CachingProviderAtomic<IEnumerable<CommentResponseDto>>(
            _redis, 
            $"comments:movies:v2:{movieId}"
        );
        
        return await topPickTempSpecificAtomic.RemoveByRootAsync();
    }
}