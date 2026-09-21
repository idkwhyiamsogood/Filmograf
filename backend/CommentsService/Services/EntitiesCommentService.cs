using Filmograf.BaseLibrary.DataAccess.Repositories;
using Filmograf.BaseLibrary.Models.Dto;
using Filmograf.BaseLibrary.Models.Entities;
using Filmograf.BaseLibrary.Models.Repo;
using Filmograf.BaseLibrary.Util;
using Filmograf.CommentsService.Models.Dto;

namespace Filmograf.CommentsService.Services;

public class EntitiesCommentService
{
    private readonly CommentService _commentService;
    private readonly CommentRepository _commentRepository;
    private readonly CommentCachingService _commentCachingService;
    
    public EntitiesCommentService(CommentService commentService, CommentRepository commentRepository, 
        CommentCachingService commentCachingService)
    {
        _commentService = commentService;
        _commentRepository = commentRepository;
        _commentCachingService = commentCachingService;
    }

    private async Task<IEnumerable<CommentResponseDto>> CreateCacheForEntityAsync(string movieId, 
        PaginationQueryDto pagination, CommentEntityType entityType)
    {
        var movieComments = await _commentRepository.GetRootsAsync(movieId, entityType,
            pagination.Page * pagination.Count, pagination.Count);
        
        return await Task.WhenAll(movieComments.Select(async child => 
            await _commentService.FillResponseCacheForCommentAsync(child)));
    }

    public async Task<IEnumerable<CommentResponseDto>> GetByEntityAsync(string movieId, PaginationQueryDto pagination, 
        CommentEntityType entityType)
    {
        var method = async () => await CreateCacheForEntityAsync(movieId, pagination, entityType);
        return await _commentCachingService.CachingEntityAsync(entityType, movieId, pagination, method);
    }

    public async Task<CommentResponseDto> AddCommentForEntityAsync(string entityId, string text, User user, 
        CommentEntityType entityType)
    {
        var newId = MongoDbUtil.GenerateNewId();
        var path = newId;
        var depth = 1;

        // собираем новый коммент
        var newComment = new CommentRepo
        {
            Id = newId,
            EntityType = entityType,
            EntityId = entityId,
            Path = path,
            UserId = user.Id,
            Text = text,
            Depth = depth
        };
        
        // отправляем в репу
        await _commentRepository.CreateAsync(newComment);
        
        // удаляем кеш для всех комментариев фильма
        await _commentCachingService.RemoveCacheForEntityAsync(entityType, entityId);
        
        // отдаем response (заодно и кеш сгенерим)
        return await _commentService.GetResponseCommentAsync(newComment.Id);
    }
}