using AutoMapper;
using Filmograf.BaseLibrary.DataAccess.Repositories;
using Filmograf.BaseLibrary.Models.Entities;
using Filmograf.BaseLibrary.Models.HttpExceptions;
using Filmograf.BaseLibrary.Models.Repo;
using Filmograf.CommentsService.Models.Dto;

namespace Filmograf.CommentsService.Services;

public class CommentService
{
    private readonly CommentRepository _commentRepository;
    private readonly CommentCachingService _commentCachingService;
    private readonly CommentLikeRepository _commentLikeRepository;
    private readonly IMapper _mapper;
    
    public CommentService(CommentRepository commentRepository, CommentCachingService commentCachingService, 
        CommentLikeRepository commentLikeRepository, IMapper mapper)
    {
        _commentRepository = commentRepository;
        _commentCachingService = commentCachingService;
        _commentLikeRepository = commentLikeRepository;
        _mapper = mapper;
    }
    
    // ~base comment
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
        return await _commentCachingService.CachingAsync(commentId, method);
    }

    public CommentResponseDto MapCommentResponse(CommentRepo comment)
    {
        var dto = _mapper.Map<CommentResponseDto>(comment);
        if (comment.IsDeleted) dto.Text = "";
        return dto;
    }

    // ~response comment
    public async Task<CommentResponseDto> FillResponseCacheForCommentAsync(CommentRepo comment)
    {
        var commentDto = MapCommentResponse(comment);
        var reactions = await _commentLikeRepository.GetByCommentAsync(comment.Id);
        
        commentDto.Likes = reactions
            .Where(i => i.Value == 1)
            .Select(i => i.UserId)
            .ToArray();
        
        commentDto.Dislikes = reactions
            .Where(i => i.Value == -1)
            .Select(i => i.UserId)
            .ToArray();
        
        commentDto.ChildsCount = await _commentRepository.CountChildrenAsync(comment.Id);

        return commentDto;
    }
    
    public async Task<CommentResponseDto> CreateResponseCacheForCommentAsync(string commentId)
    {
        var comment = await _commentRepository.GetByIdAsync(commentId);
        if (comment == null) throw new NotFoundHttpException(
            "CommentNotFound", $"Comment with id={commentId} not found.");

        var response = await FillResponseCacheForCommentAsync(comment);
        
        
        return response;
    }

    public async Task<CommentResponseDto> GetResponseCommentAsync(string commentId)
    {
        var method = async () => await CreateResponseCacheForCommentAsync(commentId);
        return await _commentCachingService.CachingResponseAsync(commentId, method);
    }
    
    // ~full-response comment
    private async Task<CommentResponseDto> CreateFullResponseCacheForCommentAsync(string commentId)
    {
        var commentDto = await CreateResponseCacheForCommentAsync(commentId);
        
        var children = await _commentRepository.GetChildrenAsync(commentId);
        var childrenDtos = await Task.WhenAll(children.Select(async child => 
            await FillResponseCacheForCommentAsync(child)));

        commentDto.Childs = childrenDtos;

        return commentDto;
    }

    public async Task<CommentResponseDto> GetFullResponseCommentAsync(string commentId)
    {
        var method = async () => await CreateFullResponseCacheForCommentAsync(commentId);
        return await _commentCachingService.CachingFullResponseAsync(commentId, method);
    }

    public async Task<CommentRepo> GetCommentWithCheckAsync(string commentId, User user)
    {
        var comment = await GetCommentAsync(commentId);
        if (comment.IsDeleted) throw new BadRequestHttpException(
            "CommentAlreadyDeleted", $"Comment with id={commentId} has been deleted.");

        if (!user.IsAdmin && comment.UserId != user.Id) throw new ForbiddenHttpException(
            "NoAccessToComment", $"User has no access to comment with id={commentId}");

        return comment;
    }
}