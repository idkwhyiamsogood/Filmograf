using Filmograf.BaseLibrary.Models.Dto;
using Filmograf.BaseLibrary.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Filmograf.MoviesService.Controllers;

[ApiController]
[Route("api/users")]
public class UsersController : CustomControllerBase
{
    private readonly UserService _userService;
    
    public UsersController(UserService userService)
    {
        _userService = userService;
    }
    
    [Authorize]
    [HttpGet("{userId}")]
    public async Task<ActionResult<UserResponseDto>> GetUserAsync(Guid userId)
    {
        var response = await _userService.GetUserInfoAsync(userId);
        return Ok(response);
    }
}