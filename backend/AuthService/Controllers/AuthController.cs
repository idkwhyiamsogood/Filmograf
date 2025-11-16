using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using Filmograf.AuthService.Models.Dto;

namespace Filmograf.AuthService.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : CustomControllerBase
{
    private readonly Services.AuthService _authService;
    
    public AuthController(Services.AuthService authService)
    {
        _authService = authService;
    }

    [HttpGet]
    [Authorize]
    public async Task<ActionResult> CheckAuthAsync()
    {
        return Ok("Successful authorization.");
    }

    [HttpPost]
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