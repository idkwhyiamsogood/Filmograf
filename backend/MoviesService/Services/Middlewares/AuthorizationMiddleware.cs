using System.Security.Claims;
using Filmograf.BaseLibrary.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.JsonWebTokens;

namespace Filmograf.MoviesService.Services.Middlewares;

public class AuthorizationMiddleware
{
    private readonly AuthValidationService _authValidationService;

    public AuthorizationMiddleware(AuthValidationService authValidationService)
    {
        _authValidationService = authValidationService;
    }

    public Func<TokenValidatedContext, Task> GetMiddlewareFunc() => async context =>
    {
        try
        {
            var userIdStr = context.Principal?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var jsonToken = context.SecurityToken as JsonWebToken;
            var token = jsonToken?.EncodedToken;

            if (userIdStr == null || token == null)
            {
                context.Fail("Поврежденный jwt токен.");
                return;
            }

            if (!Guid.TryParse(userIdStr, out var userId) ||
                !await CheckAuth(context, userId, token, context.Request.Path))
            {
                context.Fail("Ошибка авторизации.");
            }
        }
        catch (Exception ex)
        {
            context.Fail("Ошибка обработки jwt");
        }
    };
    
    private async Task<bool> CheckAuth(TokenValidatedContext context, Guid userId, string token, string path)
    {
        // получаем данные сессии
        var auth = await _authProvider.GetByJwtAsync(token);

        // проверяем все ли гуд
        if (auth == null || auth.UserId != userId || !auth.State) return false;
        
        // получаем пользователя
        var user = await _userProvider.GetAsync(userId);
        if (user == null) return false;

        // передаем payload
        var httpContext = context.HttpContext;
        var authContext = httpContext.RequestServices.GetRequiredService<AuthContext>();
    
        authContext.CurrentAuth = auth;
        authContext.CurrentUser = user;

        return true;
    }
}