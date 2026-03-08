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
    
    public CommentsController(CommentService commentService)
    {
        _commentService = commentService;
    }

    [HttpGet("{commentId}")]
    [UserTypePolicy]
    public async Task<ActionResult<CommentRepo>> GetAsync(string commentId)
    {
        var data = await _commentService.GetResponseCommentAsync(commentId);
        return Ok(data);
    }
    
    [HttpPatch("{commentId}")]
    [UserTypePolicy(Guest = false)]
    public async Task<ActionResult<CommentRepo>> EditCommentAsync(string commentId, [FromServices] AuthContext authContext, 
        [FromBody] CreateCommentRequestDto data)
    {
        // todo
        var result = await _commentService.CreateCommentAsync(commentId, data.Text, authContext.CurrentUser!);
        return Ok(result);
    }
    
    [HttpDelete("{commentId}")]
    [UserTypePolicy(Guest = false)]
    public async Task<ActionResult<CommentRepo>> DeleteCommentAsync(string commentId, [FromServices] AuthContext authContext)
    {
        // todo
        var result = await _commentService.CreateCommentAsync(commentId, data.Text, authContext.CurrentUser!);
        return Ok(result);
    }
    

    [HttpGet("{commentId}/full")]
    [UserTypePolicy]
    public async Task<ActionResult<CommentRepo>> GetFullAsync(string commentId)
    {
        var data = await _commentService.GetFullResponseCommentAsync(commentId);
        return Ok(data);
    }

    [HttpPost("{commentId}/comment")]
    [UserTypePolicy(Guest = false)]
    public async Task<ActionResult<CommentRepo>> AddCommentAsync(string commentId, [FromServices] AuthContext authContext, 
        [FromBody] CreateCommentRequestDto data)
    {
        var result = await _commentService.CreateCommentAsync(commentId, data.Text, authContext.CurrentUser!);
        return Ok(result);
    }
}