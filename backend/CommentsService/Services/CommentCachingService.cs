using Filmograf.BaseLibrary.Models.Dto;
using Filmograf.BaseLibrary.Models.Repo;
using Filmograf.CommentsService.Caching;
using Filmograf.CommentsService.Models.Dto;

namespace Filmograf.CommentsService.Services;

public class CommentCachingService
{
    private readonly CommentsCaching _commentsCaching;
    private readonly EntitiesCommentCaching _entitiesCommentCaching;
    
    public CommentCachingService(CommentsCaching commentsCaching, EntitiesCommentCaching entitiesCommentCaching)
    {
        _commentsCaching = commentsCaching;
        _entitiesCommentCaching = entitiesCommentCaching;
    }
    
    public async Task<CommentRepo> CachingAsync(string commentId,
        Func<Task<CommentRepo>> cacheFunc)
    {
        return await _commentsCaching.CachingAsync(commentId, cacheFunc);
    }

    public async Task<CommentResponseDto> CachingResponseAsync(string commentId,
        Func<Task<CommentResponseDto>> cacheFunc)
    {
        return await _commentsCaching.CachingResponseAsync(commentId, cacheFunc);
    }

    public async Task<CommentResponseDto> CachingFullResponseAsync(string commentId,
        Func<Task<CommentResponseDto>> cacheFunc)
    {
        return await _commentsCaching.CachingFullResponseAsync(commentId, cacheFunc);
    }

    public async Task<IEnumerable<CommentResponseDto>> CachingEntityAsync(CommentEntityType entityType, string entityId, PaginationQueryDto pagination,
        Func<Task<IEnumerable<CommentResponseDto>>> cacheFunc)
    {
        return await _entitiesCommentCaching.CachingResponseAsync(entityType, entityId, pagination, cacheFunc);
    }

    public async Task RemoveCacheForEntityAsync(CommentEntityType entityType, string entityId)
    {
        await _entitiesCommentCaching.RemoveCachingEntitiesRootAsync(entityType, entityId);
    }

    public async Task RemoveFullCacheAsync(string commentId)
    {
        // удаляем основной кеш
        await _commentsCaching.RemoveCachingAsync(commentId);

        // удаляем основной кеш response
        await _commentsCaching.RemoveCachingResponseAsync(commentId);
            
        // удаляем и фулл кеш response
        await _commentsCaching.RemoveCachingFullResponseAsync(commentId);
    }

    public async Task RemoveFullPathCacheAsync(string path)
    {
        var pathParts = path.Split("/");
        
        await Task.WhenAll(pathParts.Select(async part =>
        {
            await RemoveFullCacheAsync(part);
        }));
    }
    
    public async Task RemoveWithParentCacheAsync(CommentRepo commentRepo)
    {
        // удаляем основной кеш
        var removeCacheTask = RemoveFullCacheAsync(commentRepo.Id);
        
        // удаляем кеш родителя
        var removeParentCacheTask = commentRepo.ParentId != null
            ? RemoveFullCacheAsync(commentRepo.ParentId)
            : RemoveCacheForEntityAsync(commentRepo.EntityType, commentRepo.Id);

        await Task.WhenAll(removeCacheTask, removeParentCacheTask);
    }
}