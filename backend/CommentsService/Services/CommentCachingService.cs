using Filmograf.BaseLibrary.Models.Dto;
using Filmograf.BaseLibrary.Models.Repo;
using Filmograf.CommentsService.Caching;
using Filmograf.CommentsService.Models.Dto;

namespace Filmograf.CommentsService.Services;

public class CommentCachingService
{
    private readonly CommentsCaching _commentsCaching;
    private readonly MoviesCommentCaching _moviesCommentCaching;
    
    public CommentCachingService(CommentsCaching commentsCaching, MoviesCommentCaching moviesCommentCaching)
    {
        _commentsCaching = commentsCaching;
        _moviesCommentCaching = moviesCommentCaching;
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

    public async Task<IEnumerable<CommentResponseDto>> CachingMovieAsync(string movieId, PaginationQueryDto pagination,
        Func<Task<IEnumerable<CommentResponseDto>>> cacheFunc)
    {
        return await _moviesCommentCaching.CachingResponseAsync(movieId, pagination, cacheFunc);
    }

    public async Task RemoveCacheForMovieAsync(string movieId)
    {
        await _moviesCommentCaching.RemoveCachingMovieRootAsync(movieId);
    }

    public async Task RemoveCacheForCollectionAsync(string collectionId)
    {// TODO: FOR COLLECTIONS  !!!!!!!
        await _moviesCommentCaching.RemoveCachingMovieRootAsync(collectionId);
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
            : commentRepo.EntityType == CommentEntityType.Movie
                ? RemoveCacheForMovieAsync(commentRepo.Id)
                : RemoveCacheForCollectionAsync(commentRepo.Id); 

        await Task.WhenAll(removeCacheTask, removeParentCacheTask);
    }
}