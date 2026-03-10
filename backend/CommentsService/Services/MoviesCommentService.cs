using Filmograf.BaseLibrary.DataAccess.Repositories;
using Filmograf.BaseLibrary.Models.Dto;
using Filmograf.BaseLibrary.Models.Entities;
using Filmograf.BaseLibrary.Models.Repo;
using Filmograf.BaseLibrary.Util;
using Filmograf.CommentsService.Caching;
using Filmograf.CommentsService.Models.Dto;

namespace Filmograf.CommentsService.Services;

public class MoviesCommentService
{
    private readonly CommentService _commentService;
    private readonly CommentRepository _commentRepository;
    private readonly CommentCachingService _commentCachingService;
    
    public MoviesCommentService(CommentService commentService, CommentRepository commentRepository, 
        CommentCachingService commentCachingService)
    {
        _commentService = commentService;
        _commentRepository = commentRepository;
        _commentCachingService = commentCachingService;
    }

    private async Task<IEnumerable<CommentResponseDto>> CreateCacheForMovieAsync(string movieId, PaginationQueryDto pagination)
    {
        var movieComments = await _commentRepository.GetRootsAsync(movieId, CommentEntityType.Movie,
            pagination.Page * pagination.Count, pagination.Count);
        
        return await Task.WhenAll(movieComments.Select(async child => 
            await _commentService.FillResponseCacheForCommentAsync(child)));
    }

    public async Task<IEnumerable<CommentResponseDto>> GetByMovieAsync(string movieId, PaginationQueryDto pagination)
    {
        var method = async () => await CreateCacheForMovieAsync(movieId, pagination);
        return await _commentCachingService.CachingMovieAsync(movieId, pagination, method);
    }

    public async Task<CommentResponseDto> AddCommentForMovieAsync(string movieId, string text, User user)
    {
        var newId = MongoDbUtil.GenerateNewId();
        var path = newId;
        var depth = 1;

        // собираем новый коммент
        var newComment = new CommentRepo
        {
            Id = newId,
            EntityType = CommentEntityType.Movie,
            EntityId = movieId,
            Path = path,
            UserId = user.Id,
            Text = text,
            Depth = depth
        };
        
        // отправляем в репу
        await _commentRepository.CreateAsync(newComment);
        
        // удаляем кеш для всех комментариев фильма
        await _commentCachingService.RemoveCacheForMovieAsync(movieId);
        
        // отдаем response (заодно и кеш сгенерим)
        return await _commentService.GetResponseCommentAsync(newComment.Id);
    }
}