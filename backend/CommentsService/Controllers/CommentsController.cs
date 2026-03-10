using Filmograf.BaseLibrary.Models.Context;
using Filmograf.BaseLibrary.Models.Repo;
using Filmograf.CommentsService.Attributes;
using Filmograf.CommentsService.Models.Dto;
using Filmograf.CommentsService.Services;
using Microsoft.AspNetCore.Mvc;

namespace Filmograf.CommentsService.Controllers;

[ApiController]
[Route("api/comments")]
public class CommentsController : CustomControllerBase
{
    private readonly CommentService _commentService;
    private readonly CommentCreationService _commentCreationService;
    private readonly CommentLikesService _commentLikesService;
    
    public CommentsController(CommentService commentService, CommentCreationService commentCreationService, 
        CommentLikesService commentLikesService)
    {
        _commentService = commentService;
        _commentCreationService = commentCreationService;
        _commentLikesService = commentLikesService;
    }

    [HttpGet("{commentId}")]
    [UserTypePolicy]
    public async Task<ActionResult<CommentRepo>> GetAsync(string commentId)
    {
        var data = await _commentService.GetResponseCommentAsync(commentId);
        return Ok(data);
    }
    
    [HttpGet("{commentId}/full")]
    [UserTypePolicy]
    public async Task<ActionResult<CommentResponseDto>> GetFullAsync(string commentId)
    {
        var data = await _commentService.GetFullResponseCommentAsync(commentId);
        return Ok(data);
    }

    [HttpPost("{commentId}/comment")]
    [UserTypePolicy(Guest = false)]
    public async Task<ActionResult<CommentRepo>> AddCommentAsync(string commentId, [FromServices] AuthContext authContext, 
        [FromBody] CreateCommentRequestDto data)
    {
        var result = await _commentCreationService.CreateCommentAsync(commentId, data.Text, authContext.CurrentUser!);
        return Ok(result);
    }
    
    [HttpPatch("{commentId}")]
    [UserTypePolicy(Guest = false)]
    public async Task<ActionResult> EditCommentAsync(string commentId, [FromServices] AuthContext authContext, 
        [FromBody] CreateCommentRequestDto data)
    {
        await _commentCreationService.EditCommentAsync(commentId, data.Text, authContext.CurrentUser!);
        return NoContent();
    }
    
    [HttpDelete("{commentId}")]
    [UserTypePolicy(Guest = false)]
    public async Task<ActionResult> DeleteCommentAsync(string commentId, [FromServices] AuthContext authContext)
    {
        await _commentCreationService.DeleteCommentAsync(commentId, authContext.CurrentUser!);
        return NoContent();
    }


    [HttpPut("{commentId}/reaction")]
    [UserTypePolicy(Guest = false)]
    public async Task<ActionResult> LikeCommentAsync(string commentId, [FromBody] CommentReactionRequestDto data,
        [FromServices] AuthContext authContext)
    {
        await _commentLikesService.SetCommentReactionAsync(commentId, data.Reaction, authContext.CurrentUser!);
        return NoContent();
    }
}