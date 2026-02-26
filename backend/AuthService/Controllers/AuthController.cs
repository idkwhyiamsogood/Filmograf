using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;

using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;

namespace Filmograf.MoviesService.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : CustomControllerBase
{
    private readonly IConfiguration _configuration;

    public AuthController(IConfiguration configuration)
    {
        _configuration = configuration;
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
        // Получаем результат аутентификации
        var authenticateResult = await HttpContext.AuthenticateAsync(CookieAuthenticationDefaults.AuthenticationScheme);

        if (!authenticateResult.Succeeded)
        {
            var frontendUrl = _configuration["Frontend:Url"] ?? "http://localhost:3000";
            var errorMessage = authenticateResult.Failure?.Message ?? "Authentication failed";
            return Redirect($"{frontendUrl}/?error={Uri.EscapeDataString(errorMessage)}");
        }


        // Получаем информацию о пользователе
        var claims = authenticateResult.Principal?.Identities?.FirstOrDefault()?.Claims;

        // Получаем токены
        var accessToken = await HttpContext.GetTokenAsync("access_token");
        var idToken = await HttpContext.GetTokenAsync("id_token");
        var refreshToken = await HttpContext.GetTokenAsync("refresh_token");
        
        var frontendUrlSuccess = _configuration["Frontend:Url"] ?? "http://localhost:3000";
        
        // Создаем URL для редиректа на фронтенд
        var redirectUrlBuilder = new UriBuilder(frontendUrlSuccess);
        var query = System.Web.HttpUtility.ParseQueryString(string.Empty);
        
        if (!string.IsNullOrEmpty(accessToken))
            query["access_token"] = accessToken;
        if (!string.IsNullOrEmpty(idToken))
            query["id_token"] = idToken;
        if (!string.IsNullOrEmpty(refreshToken))
            query["refresh_token"] = refreshToken;
        
        redirectUrlBuilder.Query = query.ToString();
        var redirectUrl = redirectUrlBuilder.ToString();
        
        return Redirect(redirectUrl);
    }

    /// <summary>
    /// Получение информации о текущем пользователе
    /// </summary>
    [HttpGet("user")]
    public async Task<IActionResult> GetCurrentUser()
    {
        if (!User.Identity?.IsAuthenticated ?? true)
            return Unauthorized(new { message = "Пользователь не авторизован" });

        var claims = User.Claims;
        
        var userInfo = new
        {
            Id = claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value,
            Email = claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value,
            Name = claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value,
            Picture = claims.FirstOrDefault(c => c.Type == "picture")?.Value
        };

        return Ok(userInfo);
    }

    /// <summary>
    /// Получение статуса аутентификации
    /// </summary>
    [HttpGet("status")]
    public IActionResult GetAuthStatus()
    {
        return Ok(new
        {
            IsAuthenticated = User.Identity?.IsAuthenticated ?? false,
            AuthenticationType = User.Identity?.AuthenticationType
        });
    }

    /// <summary>
    /// Выход из системы
    /// </summary>
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        return Ok(new { message = "Успешный выход из системы" });
    }

    /// <summary>
    /// Обновление токена
    /// </summary>
    [HttpPost("refresh-token")]
    public async Task<IActionResult> RefreshToken()
    {
        var refreshToken = await HttpContext.GetTokenAsync("refresh_token");
        
        if (string.IsNullOrEmpty(refreshToken))
            return Unauthorized(new { message = "Refresh token не найден" });

        // Здесь должна быть логика обновления токена через Google
        // Пока возвращаем заглушку
        return Ok(new { access_token = "new_access_token" });
    }
}