using AutoMapper;
using Filmograf.BaseLibrary.DataAccess.Repositories;
using Filmograf.BaseLibrary.Models.Entities;
using Filmograf.BaseLibrary.Models.HttpExceptions;
using Filmograf.BaseLibrary.Models.Repo;
using Filmograf.BaseLibrary.Util;
using Filmograf.MoviesService.Caching;
using Filmograf.MoviesService.Models.Dto;

namespace Filmograf.MoviesService.Services;

public class CommentService
{
    private readonly CommentRepository _commentRepository;
    private readonly CommentsCaching _commentsCaching;
    private readonly IMapper _mapper;
    
    public CommentService(CommentRepository commentRepository, CommentsCaching commentsCaching, IMapper mapper)
    {
        _commentRepository = commentRepository;
        _commentsCaching = commentsCaching;
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
        return await _commentsCaching.CachingAsync(commentId, method);
    }

    // ~response comment
    private async Task<CommentResponseDto> CreateResponseCacheForCommentAsync(string commentId)
    {
        var comment = await _commentRepository.GetByIdAsync(commentId);
        if (comment == null) throw new NotFoundHttpException(
            "CommentNotFound", $"Comment with id={commentId} not found.");

        var commentDto = _mapper.Map<CommentResponseDto>(comment);

        return commentDto;
    }

    public async Task<CommentResponseDto> GetResponseCommentAsync(string commentId)
    {
        var method = async () => await CreateResponseCacheForCommentAsync(commentId);
        return await _commentsCaching.CachingResponseAsync(commentId, method);
    }
    
    // ~full-response comment
    private async Task<CommentResponseDto> CreateFullResponseCacheForCommentAsync(string commentId)
    {
        var comment = await _commentRepository.GetByIdAsync(commentId);
        if (comment == null) throw new NotFoundHttpException(
            "CommentNotFound", $"Comment with id={commentId} not found.");

        var children = await _commentRepository.GetChildrenAsync(comment.Id);
        var childrenDtos = _mapper.Map<CommentResponseDto[]>(children);

        var commentDto = _mapper.Map<CommentResponseDto>(comment);
        commentDto.Childs = childrenDtos;

        return commentDto;
    }

    public async Task<CommentResponseDto> GetFullResponseCommentAsync(string commentId)
    {
        var method = async () => await CreateFullResponseCacheForCommentAsync(commentId);
        return await _commentsCaching.CachingFullResponseAsync(commentId, method);
    }

    
    public string MakePath(CommentRepo? parentComment, string childCommentId)
    {
        if (parentComment == null) return childCommentId;
        return $"{parentComment.Path}/{childCommentId}";
    }

    private async Task RemoveFullPathCacheAsync(string path)
    {
        var pathParts = path.Split("/");
        await Task.WhenAll(pathParts.Select(async part => 
            await _commentsCaching.RemoveCachingFullResponseAsync(part)));
    }

    public async Task<CommentResponseDto> CreateCommentAsync(string commentId, string text, User user)
    {
        // если комментария нет - на этапе формирования кеша - выплюнет NF-htex
        var comment = await GetCommentAsync(commentId);

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
        await RemoveFullPathCacheAsync(comment.Path);
        
        // отдаем response (заодно и кеш сгенерим)
        return await GetResponseCommentAsync(newComment.Id);
    }
}