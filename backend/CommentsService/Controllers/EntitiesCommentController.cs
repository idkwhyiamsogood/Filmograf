using Filmograf.BaseLibrary.Models.Context;
using Filmograf.BaseLibrary.Models.Dto;
using Filmograf.BaseLibrary.Models.Repo;
using Filmograf.CommentsService.Attributes;
using Filmograf.CommentsService.Models.Dto;
using Filmograf.CommentsService.Services;
using Microsoft.AspNetCore.Mvc;

namespace Filmograf.CommentsService.Controllers;

[ApiController]
[Route("api/comments/movies")]
public class EntitiesCommentController : CustomControllerBase
{
    private readonly EntitiesCommentService _entitiesCommentService;

    public EntitiesCommentController(EntitiesCommentService entitiesCommentService)
    {
        _entitiesCommentService = entitiesCommentService;
    }
    
    [HttpGet("{movieId}")]
    [UserTypePolicy]
    public async Task<ActionResult<IEquatable<CommentResponseDto>>> GetMovieCommentsAsync(string movieId, 
        [FromQuery] PaginationQueryDto pagination, [FromQuery] CommentEntityTypeQueryDto entityTypeData)
    {
        var entityType = entityTypeData.GetEntityType();
        var result = await _entitiesCommentService.GetByEntityAsync(movieId, pagination, entityType);
        return Ok(result);
    }
    
    [HttpPost("{movieId}/comment")]
    [UserTypePolicy(Guest = false)]
    public async Task<ActionResult<CommentResponseDto>> AddMovieCommentAsync(string movieId, [FromBody] CreateCommentRequestDto data, 
        [FromServices] AuthContext authContext, [FromQuery] CommentEntityTypeQueryDto entityTypeData)
    {
        var entityType = entityTypeData.GetEntityType();
        var result = await _entitiesCommentService.AddCommentForEntityAsync(movieId, data.Text, 
            authContext.CurrentUser!, entityType);
        return Ok(result);
    }
}