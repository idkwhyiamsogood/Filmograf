using Filmograf.BaseLibrary.Models.Context;
using Filmograf.BaseLibrary.Models.Dto;
using Filmograf.BaseLibrary.Models.Repo;
using Filmograf.CommentsService.Attributes;
using Filmograf.CommentsService.Models.Dto;
using Filmograf.CommentsService.Services;
using Microsoft.AspNetCore.Mvc;

namespace Filmograf.CommentsService.Controllers;

[ApiController]
[Route("api/comments/entities")]
public class EntitiesCommentController : CustomControllerBase
{
    private readonly EntitiesCommentService _entitiesCommentService;

    public EntitiesCommentController(EntitiesCommentService entitiesCommentService)
    {
        _entitiesCommentService = entitiesCommentService;
    }
    
    [HttpGet("{entityId}")]
    [UserTypePolicy]
    public async Task<ActionResult<IEquatable<CommentResponseDto>>> GetMovieCommentsAsync(string entityId, 
        [FromQuery] PaginationQueryDto pagination, [FromQuery] CommentEntityTypeQueryDto entityTypeData)
    {
        var entityType = entityTypeData.GetEntityType();
        if (entityType == null) return BadRequest("InvalidEntityType");
        
        var result = await _entitiesCommentService.GetByEntityAsync(entityId, pagination, 
            (CommentEntityType) entityType!);
        return Ok(result);
    }
    
    [HttpPost("{entityId}/comment")]
    [UserTypePolicy(Guest = false)]
    public async Task<ActionResult<CommentResponseDto>> AddMovieCommentAsync(string entityId, [FromBody] CreateCommentRequestDto data, 
        [FromServices] AuthContext authContext, [FromQuery] CommentEntityTypeQueryDto entityTypeData)
    {
        var entityType = entityTypeData.GetEntityType();
        if (entityType == null) return BadRequest("InvalidEntityType");
        
        var result = await _entitiesCommentService.AddCommentForEntityAsync(entityId, data.Text, 
            authContext.CurrentUser!, (CommentEntityType) entityType!);
        return Ok(result);
    }
}