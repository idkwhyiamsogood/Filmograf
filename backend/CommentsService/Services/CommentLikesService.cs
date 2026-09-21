using Filmograf.BaseLibrary.DataAccess.Repositories;
using Filmograf.BaseLibrary.Models.Entities;

namespace Filmograf.CommentsService.Services;

public class CommentLikesService
{
    private readonly CommentService _commentService;
    private readonly CommentLikeRepository _commentLikeRepository;
    private readonly CommentCachingService _commentCachingService;

    public CommentLikesService(CommentService commentService, CommentLikeRepository commentLikeRepository, 
        CommentCachingService commentCachingService)
    {
        _commentService = commentService;
        _commentLikeRepository = commentLikeRepository;
        _commentCachingService = commentCachingService;
    }
    
    public async Task SetCommentReactionAsync(string commentId, int reactionValue, User user)
    {
        // это чтобы проверить существование комментария
        var comment = await _commentService.GetCommentAsync(commentId);
        
        // чекаем текущую реакцию
        var reaction = await _commentLikeRepository.GetUserReactionAsync(commentId, user.Id);
            
        // если есть реакция и мы пытаемся поставить ту же - ливаем
        if (reaction != null && reaction.Value == reactionValue) return;
        
        // если нет реакции и мы пытаемся ее отменить - ливаем
        if (reaction == null && reactionValue == 0) return;

        // если была установлена реакция
        if (reaction != null && reactionValue == 0)
        {
            await _commentLikeRepository.RemoveAsync(commentId, user.Id);
            
            // удаляем фулл-кеш
            await _commentCachingService.RemoveWithParentCacheAsync(comment);
            
            return;
        }
        
        // иначе просто поставим реакцию
        await _commentLikeRepository.UpsertAsync(commentId, user.Id, reactionValue);
        
        // удаляем фулл-кеш
        await _commentCachingService.RemoveWithParentCacheAsync(comment);
    }
}