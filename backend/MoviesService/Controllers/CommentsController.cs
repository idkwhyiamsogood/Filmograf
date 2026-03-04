using Filmograf.BaseLibrary.Models.Context;
using Filmograf.BaseLibrary.Models.Repo;
using Filmograf.MoviesService.Attributes;
using Filmograf.MoviesService.Models.Dto;
using Filmograf.MoviesService.Services;
using Microsoft.AspNetCore.Mvc;

namespace Filmograf.MoviesService.Controllers;

[ApiController]
[Route("api/comments")]
public class CommentsController : CustomControllerBase
{
    private readonly CommentService _commentService;
    
    public CommentsController(CommentService commentService)
    {
        _commentService = commentService;
    }

    [HttpGet("{id}")]
    [UserTypePolicy]
    public async Task<ActionResult<CommentRepo>> GetAsync(string id)
    {
        var data = await _commentService.GetResponseCommentAsync(id);
        return Ok(data);
    }

    [HttpGet("{id}/full")]
    [UserTypePolicy]
    public async Task<ActionResult<CommentRepo>> GetFullAsync(string id)
    {
        var data = await _commentService.GetFullResponseCommentAsync(id);
        return Ok(data);
    }

    [HttpPost("{id}/comment")]
    [UserTypePolicy(Guest = false)]
    public async Task<ActionResult<CommentRepo>> CommentAsync(string id, [FromServices] AuthContext authContext, 
        [FromBody] CreateCommentRequestDto data)
    {
        var result = await _commentService.CreateCommentAsync(id, data.Text, authContext.CurrentUser!);
        return Ok(result);
    }
}