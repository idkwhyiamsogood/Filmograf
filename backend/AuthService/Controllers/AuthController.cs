using System.Security.Claims;
using Filmograf.BaseLibrary.Models.Types;
using Filmograf.MoviesService.Services;
using Microsoft.AspNetCore.Mvc;

using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authorization;

namespace Filmograf.MoviesService.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : CustomControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly UserService _userService;
    private readonly JwtService _jwtService;

    public AuthController(IConfiguration configuration, UserService userService, JwtService jwtService)
    {
        _configuration = configuration;
        _userService = userService;
        _jwtService = jwtService;
    }
    
    [HttpGet("google")]
    public IActionResult GoogleLogin()
    {
        // Генерируем и сохраняем state для защиты от CSRF
        var redirectUrl = Url.Action(nameof(GoogleCallback), "Auth", null, Request.Scheme);

        var properties = new AuthenticationProperties
        {
            RedirectUri = redirectUrl,
            Items = 
            {
                { "scheme", GoogleDefaults.AuthenticationScheme },
                // Добавляем дополнительную информацию
                { "returnUrl", _configuration["Frontend:Url"] ?? "http://localhost:3000" }
            }
        };

        return Challenge(properties, GoogleDefaults.AuthenticationScheme);
    }

    [HttpGet("google-callback")]
    public async Task<IActionResult> GoogleCallback()
    {
        var result = await HttpContext.AuthenticateAsync(GoogleDefaults.AuthenticationScheme);

        if (!result.Succeeded)
            return Unauthorized();

        var claims = result.Principal?.Claims;

        var email = claims?.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
        var googleId = claims?.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        var name = claims?.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;

        if (email == null || googleId == null)
            return Unauthorized();

        var user = await _userService.GetByGoogleIdAsync(googleId);

        if (user == null)
        {
            var newUserEntity = new User
            {
                Email = email,
                GoogleId = googleId,
                Name = name,
                UserType = "Member"
            };
            
            user = await _userService.CreateUserAsync(newUserEntity);
        }

        var jwt = _jwtService.GenerateToken(user);

        var frontendUrl = _configuration["Frontend:Url"];
        return Redirect($"{frontendUrl}/auth-success?token={jwt}");
    }

    /// <summary>
    /// Получение информации о текущем пользователе
    /// </summary>
    [Authorize]
    [HttpGet("fetch")]
    public async Task<IActionResult> Fetch()
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!Guid.TryParse(userIdStr, out var userId))
            return Unauthorized();

        var user = await _userService.GetByIdAsync(userId);

        if (user == null)
            return Unauthorized();

        return Ok(new
        {
            user.Id,
            user.Email,
            user.Name,
            user.GoogleId
        });
    }

    /// <summary>
    /// Получение статуса аутентификации
    /// </summary>
    [Authorize]
    [HttpGet("status")]
    public IActionResult Status()
    {
        return Ok(new
        {
            IsAuthenticated = true,
            UserId = User.FindFirstValue(ClaimTypes.NameIdentifier),
            Email = User.FindFirstValue(ClaimTypes.Email)
        });
    }
}