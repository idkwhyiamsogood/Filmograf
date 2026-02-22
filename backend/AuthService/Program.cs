using System.Security.Claims;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.OpenApi.Models;
using StackExchange.Redis;

using Filmograf.MoviesService.Util;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.OAuth;
using Microsoft.EntityFrameworkCore;

namespace Filmograf.MoviesService;

public class Program
{
    public async static Task Main(string[] args)
    {
        AppSettingsUtil.LoadAppSettingsData();
        
        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container.
        builder.Services.AddControllers();
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        
        
        
        
        SettingUpSwagger(builder);
        SettingUpCors(builder);
        SettingUpContexts(builder);
        SettingUpRedis(builder);
        SettingComponents(builder);
        SettingUpAuthenticationService(builder);
        
        var app = builder.Build();

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseCors("AllowFrontend"); // todo: в проде поменять
        app.UseAuthentication();
        app.UseAuthorization();
        
        app.MapControllers();
        app.Run();
    }
    
    private static void SettingUpSwagger(WebApplicationBuilder builder)
    {
        builder.Services.AddSwaggerGen(c =>
        {
            c.AddSecurityDefinition("S5kAuth", new OpenApiSecurityScheme
            {
                Description = "Введите ваш токен",
                Name = "X-Auth-Token",
                In = ParameterLocation.Header,
                Type = SecuritySchemeType.ApiKey
            });

            c.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "S5kAuth"
                        }
                    },
                    new string[] { }
                }
            });
        });
    }
    
    private static void SettingUpCors(WebApplicationBuilder builder)
    {
        // Настройка Cors
        builder.Services.AddCors(options =>
        {
            // options.AddPolicy("AllowAll",
            //     policy =>
            //     {
            //         policy.AllowAnyOrigin()
            //             .AllowCredentials()
            //             .AllowAnyMethod()
            //             .AllowAnyHeader();
            //     });

            options.AddPolicy("AllowFrontend",
                policy => 
                {
                    policy.WithOrigins(
                            "http://localhost:3000",     // Next.js dev server
                            "https://localhost:3000"    // HTTPS version
                        )
                        .AllowCredentials()              // Разрешаем куки
                        .AllowAnyHeader()                // Разрешаем любые заголовки
                        .AllowAnyMethod()                // Разрешаем любые HTTP методы
                        .SetIsOriginAllowedToAllowWildcardSubdomains();
                });
        });
    }
    
    private static void SettingUpContexts(WebApplicationBuilder builder)
    {
        
    }
    
    private static void SettingUpRedis(WebApplicationBuilder builder)
    {
        var redisSettings = AppSettingsUtil.AppSettings.RedisSettings;
        Console.WriteLine(redisSettings.Host);
        
        builder.Services.AddSingleton<IConnectionMultiplexer>(sp => 
            ConnectionMultiplexer.Connect($"{redisSettings.Host}:6379,abortConnect=false"));
    }

    private static void SettingComponents(WebApplicationBuilder builder)
    {
        builder.Services.AddTransient<FileExtensionContentTypeProvider>();
    }

    private static void SettingUpAuthenticationService(WebApplicationBuilder builder)
    {
        // builder.Services.AddAuthentication(options =>
        //     {
        //         options.DefaultAuthenticateScheme = S5kAuthSchemeOptions.SchemeName;
        //         options.DefaultChallengeScheme = S5kAuthSchemeOptions.SchemeName;
        //     })
        //     .AddScheme<S5kAuthSchemeOptions, S5kAuthHandler>(
        //         S5kAuthSchemeOptions.SchemeName, 
        //         options => { });

        builder.Services.AddAuthentication(options =>
            {
                options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = GoogleDefaults.AuthenticationScheme;
            })
            .AddCookie(options =>
            {
                options.Cookie.Name = "auth_cookie";
                options.Cookie.SameSite = SameSiteMode.Lax;
                options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
                options.Cookie.HttpOnly = true;
                options.Cookie.MaxAge = TimeSpan.FromDays(7);
                options.ExpireTimeSpan = TimeSpan.FromDays(7);
                options.SlidingExpiration = true;
                options.LoginPath = "/api/auth/google";
                options.AccessDeniedPath = "/api/auth/denied";

                // ВАЖНО: Добавляем обработчик событий для отладки
                options.Events = new CookieAuthenticationEvents
                {
                    OnRedirectToLogin = context =>
                    {
                        if (context.Request.Path.StartsWithSegments("/api"))
                        {
                            context.Response.StatusCode = 401;
                            return Task.CompletedTask;
                        }

                        context.Response.Redirect(context.RedirectUri);
                        return Task.CompletedTask;
                    }
                };
            })
            .AddGoogle(options =>
            {
                options.ClientId = builder.Configuration["Google:ClientId"];
                options.ClientSecret = builder.Configuration["Google:ClientSecret"];
                options.CallbackPath = "/api/auth/google-callback";
                options.SaveTokens = true;
                options.Scope.Add("profile");
                options.Scope.Add("email");
                options.Scope.Add("openid");

                options.Events = new OAuthEvents
                {
                    OnRedirectToAuthorizationEndpoint = context =>
                    {
                        Console.WriteLine($"=== Redirecting to Google: {context.RedirectUri} ===");
                        context.Response.Redirect(context.RedirectUri);
                        return Task.CompletedTask;
                    },
                    OnCreatingTicket = async context =>
                    {
                        Console.WriteLine("=== Creating ticket ===");
                        var identity = (ClaimsIdentity)context.Principal.Identity;

                        var picture = context.User.GetProperty("picture").GetString();
                        if (!string.IsNullOrEmpty(picture))
                        {
                            identity.AddClaim(new Claim("picture", picture));
                        }

                        context.Properties.StoreTokens(new[]
                        {
                            new AuthenticationToken { Name = "access_token", Value = context.AccessToken },
                            new AuthenticationToken { Name = "refresh_token", Value = context.RefreshToken },
                            new AuthenticationToken { Name = "id_token", Value = context.Identity.ToString() },
                            new AuthenticationToken { Name = "token_type", Value = context.TokenType },
                            new AuthenticationToken { Name = "expires_at", Value = context.ExpiresIn?.ToString() }
                        });
                    },
                    OnRemoteFailure = context =>
                    {
                        Console.WriteLine($"=== Remote failure: {context.Failure?.Message} ===");

                        // ВАЖНО: Редиректим на фронтенд, а не на бекенд
                        var frontendUrl = builder.Configuration["Frontend:Url"] ?? "http://localhost:3000";
                        context.Response.Redirect($"{frontendUrl}/?error={Uri.EscapeDataString(context.Failure?.Message ?? "Unknown error")}");

                        context.HandleResponse();
                        return Task.CompletedTask;
                    }
                };
            });
    }
}
