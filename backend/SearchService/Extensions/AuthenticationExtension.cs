using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

using Filmograf.BaseLibrary.Util;
using Filmograf.SearchService.Services.Middlewares;

namespace Filmograf.SearchService.Extensions;

internal static class AuthenticationExtension
{
    public static IServiceCollection AddAuthenticationConfig(this IServiceCollection services)
    {
        // Добавляем AuthorizationMiddleware в Scoped
        services.AddScoped<AuthorizationMiddleware>();
        
        // Настройка авторизации через JWT
        var jwtSecret = AppSettingsUtil.AppSettings.SecretsSettings.JwtSecret;
        var validIssuer = AppSettingsUtil.AppSettings.SecretsSettings.JwtValidIssuer;
        var validAudience = AppSettingsUtil.AppSettings.SecretsSettings.JwtValidAudience;
        var key = Encoding.UTF8.GetBytes(jwtSecret);
        services
            .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = validIssuer,
                    ValidAudience = validAudience,
                    IssuerSigningKey = new SymmetricSecurityKey(key)
                };

                options.Events = new JwtBearerEvents
                {
                    OnTokenValidated = async context =>
                    {
                        // Получаем auth middleware через контекст
                        var authMiddleware = context.HttpContext.RequestServices
                            .GetRequiredService<AuthorizationMiddleware>();
                            
                        await authMiddleware.GetMiddlewareFunc()(context);
                    }
                };
            });

        return services;
    }
}