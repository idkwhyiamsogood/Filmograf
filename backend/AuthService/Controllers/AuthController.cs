using Filmograf.BaseLibrary.Models.Context;
using Filmograf.BaseLibrary.Models.Types;
using Filmograf.BaseLibrary.Util;
using Filmograf.MoviesService.Models.Dto;
using Filmograf.MoviesService.Services;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Net.Http.Headers;

namespace Filmograf.MoviesService.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : CustomControllerBase
{
    private readonly GoogleO2AuthService _googleO2AuthService;

    public AuthController(GoogleO2AuthService googleO2AuthService)
    {
        _googleO2AuthService = googleO2AuthService;
    }
    
    [HttpGet("google")]
    public IActionResult GoogleLogin()
    {
        // Указываем путь к методу, который сгенерирует JWT
        var redirectUrl = Url.Action(nameof(GoogleResponse), "Auth", null, Request.Scheme);

        var properties = new AuthenticationProperties
        { RedirectUri = redirectUrl };

        return Challenge(properties, GoogleDefaults.AuthenticationScheme);
    }

    [HttpGet("temporary")]
    public async Task<ActionResult> TemporaryLoginAsync()
    {
        // todo
        throw new NotImplementedException();
    }

    [HttpGet("google-response")] 
    public async Task<IActionResult> GoogleResponse()
    {
        var result = await HttpContext.AuthenticateAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        var userAgent = HttpContext.Request.Headers[HeaderNames.UserAgent].ToString();
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();

        var idempotence = await _googleO2AuthService.ProcessingGoogleResponseAsync(result, userAgent, ip);
            
        // ВАЖНО: Удаляем временную куку, так как дальше мы работаем только по idempotenceCode
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            
        // Редиректим на фронт с idempotence кодом
        var frontendUrl = AppSettingsUtil.AppSettings.OriginSettings.FrontendOrigin;
        return Redirect($"{frontendUrl}/auth-success?idempotence={idempotence}");
    }

    [HttpPost("verify-idempotence-code")]
    public async Task<ActionResult<VerifyIdempotenceResponseDto>> VerifyIdempotenceCodeAsync(
        [FromBody] VerifyIdempotenceRequestDto data)
    {
        var userAgent = HttpContext.Request.Headers[HeaderNames.UserAgent].ToString();
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
            
        var jwt = await _googleO2AuthService.VerifyIdempotenceCodeAsync(data.Code, userAgent, ip);
            
        var response = new VerifyIdempotenceResponseDto { Jwt = jwt };
        return Ok(response);
    }

    /// <summary>
    /// Получение информации о текущем пользователе
    /// </summary>
    [Authorize]
    [HttpGet("fetch")]
    public async Task<ActionResult<User>> Fetch([FromServices] AuthContext authContext)
    {
        return Ok(authContext.CurrentUser!);
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
            IsAuthenticated = true
        });
    }
}