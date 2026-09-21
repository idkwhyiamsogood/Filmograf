using System.Security.Claims;
using Filmograf.BaseLibrary.Models.Context;
using Filmograf.BaseLibrary.Models.HttpExceptions;
using Filmograf.BaseLibrary.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.JsonWebTokens;

namespace Filmograf.CommentsService.Services.Middlewares;

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

            if (!Guid.TryParse(userIdStr, out var userId))
            {
                context.Fail("Ошибка авторизации.");
                return;
            }

            var authResult = await CheckAuth(context, userId, token, context.Request.Path);
            if (!authResult.State)
            {
                context.Fail(authResult.Message);
            }
        }
        catch (Exception ex)
        {
            context.Fail("Ошибка обработки jwt");
        }
    };
    
    private async Task<CheckAuthPayload> CheckAuth(TokenValidatedContext context, Guid userId, string token, string path)
    {
        try
        {
            // проверяем авторизацию
            var authContext = await _authValidationService.CheckAuthAsync(userId, token);
            
            // передаем payload
            var httpContext = context.HttpContext;
            var requiredAuthContext = httpContext.RequestServices.GetRequiredService<AuthContext>();
    
            requiredAuthContext.CurrentAuth = authContext.CurrentAuth;
            requiredAuthContext.CurrentUser = authContext.CurrentUser;
            
            return new CheckAuthPayload { State = true, Message = "OK" };
        }
        catch (HttpException htex)
        {
            return new CheckAuthPayload { State = false, Message = htex.Message };
        }
        catch (Exception ex)
        {
            return new CheckAuthPayload { State = false, Message = "Ошибка авторизации." };
        }
    }
    
    struct CheckAuthPayload
    {
        public bool State { get; set; }
        public string Message { get; set; }
    }
}

