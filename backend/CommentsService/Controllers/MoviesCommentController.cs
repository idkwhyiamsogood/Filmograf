using Filmograf.BaseLibrary.Models.Context;
using Filmograf.BaseLibrary.Models.Dto;
using Filmograf.CommentsService.Attributes;
using Filmograf.CommentsService.Models.Dto;
using Filmograf.CommentsService.Services;
using Microsoft.AspNetCore.Mvc;

namespace Filmograf.CommentsService.Controllers;

[ApiController]
[Route("api/comments/movies")]
public class MoviesCommentController : CustomControllerBase
{
    private readonly MoviesCommentService _moviesCommentService;

    public MoviesCommentController(MoviesCommentService moviesCommentService)
    {
        _moviesCommentService = moviesCommentService;
    }
    
    [HttpGet("{movieId}")]
    [UserTypePolicy]
    public async Task<ActionResult<IEquatable<CommentResponseDto>>> GetMovieCommentsAsync(string movieId, 
        [FromQuery] PaginationQueryDto pagination)
    {
        var result = await _moviesCommentService.GetByMovieAsync(movieId, pagination);
        return Ok(result);
    }
    
    [HttpPost("{movieId}/comment")]
    [UserTypePolicy(Guest = false)]
    public async Task<ActionResult<CommentResponseDto>> AddMovieCommentAsync(string movieId, [FromBody] CreateCommentRequestDto data, 
        [FromServices] AuthContext authContext)
    {
        var result = await _moviesCommentService.AddCommentForMovieAsync(movieId, data.Text, authContext.CurrentUser!);
        return Ok(result);
    }
}