using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using Filmograf.MoviesService.Models.Dto;
using Filmograf.MoviesService.Services;

namespace Filmograf.MoviesService.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : CustomControllerBase
{
    private readonly AuthService _authService;
    
    public AuthController(AuthService authService)
    {
        _authService = authService;
    }

    [HttpGet("check-auth")]
    [Authorize]
    public async Task<ActionResult> CheckAuthAsync()
    {
        return Ok("Successful authorization.");
    }

    [HttpPost("login")]
    public async Task<ActionResult<LoginResponseDto>> LoginAsync()
    {
        try
        {
            var data = await _authService.LoginAsync();
            return Ok(data);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}