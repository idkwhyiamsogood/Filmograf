using Filmograf.BaseLibrary.DataAccess.Repositories;
using Filmograf.BaseLibrary.Models.HttpExceptions;
using Filmograf.BaseLibrary.Models.Repo;
using Filmograf.MoviesService.Caching;

namespace Filmograf.MoviesService.Services;

public class CommentService
{
    private readonly CommentRepository _commentRepository;
    private readonly CommentsCaching _commentsCaching;
    
    public CommentService(CommentRepository commentRepository, CommentsCaching commentsCaching)
    {
        _commentRepository = commentRepository;
        _commentsCaching = commentsCaching;
    }

    private async Task<CommentRepo> CreateCacheForCommentAsync(string commentId)
    {
        var comment = await _commentRepository.GetByIdAsync(commentId);
        if (comment == null) throw new NotFoundHttpException(
            "CommentNotFound", $"Comment with id={commentId} not found.");

        return comment;
    }

    public async Task<CommentRepo> GetCommentAsync(string commentId)
    {
        var method = async () => await CreateCacheForCommentAsync(commentId);
        return await _commentsCaching.CachingAsync(commentId, method);
    }
}