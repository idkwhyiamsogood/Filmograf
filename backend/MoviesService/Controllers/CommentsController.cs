using Filmograf.BaseLibrary.Models.Context;
using Filmograf.BaseLibrary.Models.Repo;
using Filmograf.MoviesService.Attributes;
using Filmograf.MoviesService.Models.Dto;
using Filmograf.MoviesService.Services;
using Microsoft.AspNetCore.Mvc;

namespace Filmograf.MoviesService.Controllers;

public class CommentsController : CustomControllerBase
{
    private readonly CommentService _commentService;
    
    public CommentsController()
    {
        
    }

    [HttpGet("root/{id}")]
    public async Task<ActionResult<CommentRepo>> GetAsync(string guid)
    {
        var data = await _
    }

    [HttpPost]
    [UserTypePolicy(Guest = false)]
    public async Task<ActionResult<CommentRepo>> CommentAsync([FromQuery] CommentPathQueryDto commentPath,
        [FromServices] AuthContext authContext, [FromBody] CreateCommentRequestDto data)
    {
        
    }
    
}