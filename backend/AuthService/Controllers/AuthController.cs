using Filmograf.BaseLibrary.Models.Context;
using Filmograf.BaseLibrary.Models.Entities;
using Filmograf.BaseLibrary.Util;
using Filmograf.MoviesService.Models.Dto;
using Filmograf.MoviesService.Services;
using Google.Apis.Auth;
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
    private readonly TemporaryAuthService _temporaryAuthService;
    private readonly CommonAuthService _commonAuthService;

    public AuthController(GoogleO2AuthService googleO2AuthService, TemporaryAuthService temporaryAuthService,
        CommonAuthService commonAuthService)
    {
        _googleO2AuthService = googleO2AuthService;
        _temporaryAuthService = temporaryAuthService;
        _commonAuthService = commonAuthService;
    }
    
    [HttpGet("google")]
    public IActionResult GoogleLogin([FromQuery] string? returnUrl = null)
    {
        // путь к методу, который продолжит авторизацию (перекидываем на 2ой этап)
        var redirectUrl = Url.Action(nameof(GoogleResponse), "Auth", null, Request.Scheme);
        // var redirectUrl = $"https://filmograf.online/api/auth/google-response";

        var properties = new AuthenticationProperties
        { RedirectUri = redirectUrl };
        
        var origin = returnUrl ?? Request.Headers[HeaderNames.Referer].ToString();
        properties.Items.Add("returnUrl", origin);

        return Challenge(properties, GoogleDefaults.AuthenticationScheme);
    }

    [HttpGet("temporary")]
    public async Task<ActionResult<AuthResponseDto>> TemporaryLoginAsync()
    {
        var userAgent = HttpContext.Request.Headers[HeaderNames.UserAgent].ToString();
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();

        var jwt = await _temporaryAuthService.ProcessingTemporaryAuthAsync(userAgent, ip);
        
        var response = new AuthResponseDto { Jwt = jwt };
        return Ok(response);
    }

    [HttpGet("google-response")] 
    public async Task<IActionResult> GoogleResponse()
    {
        var result = await HttpContext.AuthenticateAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        var userAgent = HttpContext.Request.Headers[HeaderNames.UserAgent].ToString();
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
        
        if (!result.Properties.Items.TryGetValue("returnUrl", out var frontendOrigin) || string.IsNullOrEmpty(frontendOrigin))
        {
            frontendOrigin = AppSettingsUtil.AppSettings.OriginSettings.FrontendOrigin.Split(";")[0];
        }

        var idempotence = await _googleO2AuthService.ProcessingGoogleResponseAsync(result, userAgent, ip);
            
        // ВАЖНО: Удаляем временную куку, так как дальше мы работаем только по idempotenceCode
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            
        // Редиректим на фронт с idempotence кодом
        return Redirect($"{frontendOrigin}/auth-success?idempotence={idempotence}");
    }

    [HttpPost("verify-idempotence-code")]
    public async Task<ActionResult<AuthResponseDto>> VerifyIdempotenceCodeAsync(
        [FromBody] VerifyIdempotenceRequestDto data)
    {
        var userAgent = HttpContext.Request.Headers[HeaderNames.UserAgent].ToString();
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
            
        var jwt = await _googleO2AuthService.VerifyIdempotenceCodeAsync(data.Code, userAgent, ip);
            
        var response = new AuthResponseDto { Jwt = jwt };
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

    
    [HttpPatch("refresh-token")]
    public async Task<ActionResult<AuthResponseDto>> RefreshTokenAsync()
    {
        var userAgent = HttpContext.Request.Headers[HeaderNames.UserAgent].ToString();
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
        
        var jwt = GetJwt();
        if (jwt == null) return Unauthorized();
        
        var result = await _commonAuthService.RefreshJwtAsync(jwt, userAgent, ip);
        return Ok(result);
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
    
    [HttpPost("google-native")]
    public async Task<ActionResult<AuthResponseDto>> GoogleNativeLoginAsync([FromBody] GoogleNativeTokenDto data)
    {
        var userAgent = HttpContext.Request.Headers[HeaderNames.UserAgent].ToString();
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();

        try
        {
            // Настройки валидации (сюда нужно передать ClientId из Google Console, который ты делал для Android/iOS)
            var settings = new GoogleJsonWebSignature.ValidationSettings()
            {
                Audience = new List<string>
                {
                    AppSettingsUtil.AppSettings.GoogleO2AuthSettings.AndroidClientId,
                    AppSettingsUtil.AppSettings.GoogleO2AuthSettings.ClientId,
                }
            };

            // валидируем токен, который прислала мобилка. 
            // если токен фейковый или протух, метод выкинет Exception.
            var payload = await GoogleJsonWebSignature.ValidateAsync(data.IdToken, settings);

            // Здесь мы получили данные юзера (payload.Email, payload.Name, payload.Subject - это GoogleId)
            var jwt = await _googleO2AuthService.ProcessNativeGoogleUserAsync(payload, userAgent, ip);

            return Ok(new AuthResponseDto { Jwt = jwt });
        }
        catch (InvalidJwtException)
        {
            return Unauthorized("Invalid Google Token");
        }
    }
}