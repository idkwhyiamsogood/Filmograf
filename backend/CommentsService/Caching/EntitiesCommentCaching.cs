using Filmograf.BaseLibrary.Caching;
using Filmograf.BaseLibrary.Models.Dto;
using Filmograf.BaseLibrary.Models.Repo;
using Filmograf.CommentsService.Models.Dto;
using Filmograf.CommentsService.Util;
using StackExchange.Redis;

namespace Filmograf.CommentsService.Caching;

public class EntitiesCommentCaching
{
    protected static readonly TimeSpan DefaultExpirationTime = new TimeSpan(0, 30, 0);
    
    protected readonly CachingProviderAtomic<IEnumerable<CommentResponseDto>> _cachingAtomic;
    private readonly IConnectionMultiplexer _redis;
    
    public EntitiesCommentCaching(IConnectionMultiplexer redis)
    {
        _redis = redis;
        _cachingAtomic = new CachingProviderAtomic<IEnumerable<CommentResponseDto>>(redis, $"comments");
    }
    
    private string MakeKey(CommentEntityType entityType, string entityId, PaginationQueryDto pagination)
    {
        var entityTypeKey = entityType.GetCommentEntityTypeKey();
        var paginationHash = pagination.ToString();
        return _cachingAtomic.MakeIdKey($"{entityTypeKey}:{entityId}:{paginationHash}");
    }
    
    public virtual async Task<IEnumerable<CommentResponseDto>> CachingResponseAsync(CommentEntityType entityType, string entityId, 
        PaginationQueryDto pagination, Func<Task<IEnumerable<CommentResponseDto>>> createItem)
    {
        var key = MakeKey(entityType, entityId, pagination);
        return await _cachingAtomic.GetOrCreateAsync(key, createItem, DefaultExpirationTime);
    }

    public async Task ResetCachingResponseAsync(CommentEntityType entityType, string entityId, PaginationQueryDto pagination, 
        Func<Task<IEnumerable<CommentResponseDto>>> createItem)
    {
        var key = MakeKey(entityType, entityId, pagination);
        var payloadData = await createItem();
        await _cachingAtomic.CreateAsync(key, payloadData, DefaultExpirationTime);
    }

    public async Task<bool> RemoveCachingResponseAsync(CommentEntityType entityType, string entityId, PaginationQueryDto pagination)
    {
        var key = MakeKey(entityType, entityId, pagination);
        return await _cachingAtomic.RemoveAsync(key);
    }
    
    public async Task<long> RemoveCachingEntitiesRootAsync(CommentEntityType entityType, string entityId)
    {
        var entityTypeKey = entityType.GetCommentEntityTypeKey();
        var topPickTempSpecificAtomic = new CachingProviderAtomic<IEnumerable<CommentResponseDto>>(
            _redis, 
            $"comments:{entityTypeKey}:{entityId}"
        );
        
        return await topPickTempSpecificAtomic.RemoveByRootAsync();
    }
}