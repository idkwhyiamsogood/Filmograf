using Filmograf.BaseLibrary.DataAccess.Repositories;
using Filmograf.BaseLibrary.Models.Entities;
using Filmograf.BaseLibrary.Models.HttpExceptions;
using Filmograf.BaseLibrary.Models.Repo;
using Filmograf.BaseLibrary.Util;
using Filmograf.CommentsService.Models.Dto;

namespace Filmograf.CommentsService.Services;

public class CommentCreationService
{
    private readonly CommentService _commentService;
    private readonly CommentRepository _commentRepository;
    private readonly CommentCachingService _commentCachingService;
    
    public CommentCreationService(CommentService commentService, CommentRepository commentRepository, 
        CommentCachingService commentCachingService)
    {
        _commentService = commentService;
        _commentRepository = commentRepository;
        _commentCachingService = commentCachingService;
    }
    
    public string MakePath(CommentRepo? parentComment, string childCommentId)
    {
        if (parentComment == null) return childCommentId;
        return $"{parentComment.Path}/{childCommentId}";
    }

    public async Task<CommentResponseDto> CreateCommentAsync(string commentId, string text, User user)
    {
        // если комментария нет - на этапе формирования кеша - выплюнет NF-htex
        var comment = await _commentService.GetCommentAsync(commentId);
        
        if (comment.IsDeleted) throw new BadRequestHttpException(
            "CommentAlreadyDeleted", $"Comment with id={commentId} has been deleted.");

        // заранее генерим id, формируем path, расчитываем глубину
        var newId = MongoDbUtil.GenerateNewId();
        var path = MakePath(comment, newId);
        var depth = path.Count(i => i == '/') + 1;

        // собираем новый коммент
        var newComment = new CommentRepo
        {
            Id = newId,
            EntityType = CommentEntityType.Movie,
            ParentId = commentId,
            Path = path,
            UserId = user.Id,
            Text = text,
            Depth = depth
        };
        
        // отправляем в репу
        await _commentRepository.CreateAsync(newComment);
        
        // удаляем фулл-кеш родителя, родителя родителя и тд (т.к. у него появился новый child)
        await _commentCachingService.RemoveFullPathCacheAsync(comment.Path);
        
        // отдаем response (заодно и кеш сгенерим)
        return await _commentService.GetResponseCommentAsync(newComment.Id);
    }

    public async Task EditCommentAsync(string commentId, string text, User user)
    {
        var comment = await _commentService.GetCommentWithCheckAsync(commentId, user);
        comment.Text = text;
        
        // удаляем фулл-кеш, фулл-кеш родителя, родителя родителя и тд
        await _commentCachingService.RemoveWithParentCacheAsync(comment);

        await _commentRepository.UpdateAsync(commentId, comment);
    }

    public async Task DeleteCommentAsync(string commentId, User user)
    {
        var comment = await _commentService.GetCommentWithCheckAsync(commentId, user);
        comment.IsDeleted = true;
        
        // удаляем фулл-кеш, фулл-кеш родителя, родителя родителя и тд
        await _commentCachingService.RemoveWithParentCacheAsync(comment);

        await _commentRepository.UpdateAsync(commentId, comment);
    }
}