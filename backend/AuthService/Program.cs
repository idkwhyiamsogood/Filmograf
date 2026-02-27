using System.Security.Claims;
using System.Text;
using Filmograf.BaseLibrary.DataAccess.DbContext;
using Filmograf.BaseLibrary.DataAccess.Providers;
using Filmograf.BaseLibrary.Util;
using Filmograf.MoviesService.Services;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.OpenApi.Models;
using StackExchange.Redis;

using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authentication.OAuth;
using Microsoft.IdentityModel.Tokens;

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
            c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                Description = "Введите JWT в формате: Bearer {token}",
                Name = "Authorization",
                In = ParameterLocation.Header,
                Type = SecuritySchemeType.Http,
                Scheme = "bearer",
                BearerFormat = "JWT"
            });

            c.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        }
                    },
                    Array.Empty<string>()
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
        // common utils
        builder.Services.AddTransient<FileExtensionContentTypeProvider>();
        
        // database contexts
        builder.Services.AddScoped<DbContextBase>();
        
        // services
        builder.Services.AddScoped<JwtService>();
        builder.Services.AddScoped<UserService>();
        
        // providers
        builder.Services.AddScoped<UserProvider>();
        
        // cache
        // ..
    }

    private static void SettingUpAuthenticationService(WebApplicationBuilder builder)
    {
        var secretsSettings = AppSettingsUtil.AppSettings.SecretsSettings;
        var jwtSecret = secretsSettings.JwtSecret;
        var validIssuer = secretsSettings.JwtValidIssuer;
        var validAudience = secretsSettings.JwtValidAudience;
        var key = Encoding.UTF8.GetBytes(jwtSecret);

        builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                
                options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme; // для Google
            })
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
            })
            .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme, options =>
            {
                options.Cookie.Name = "auth_cookie";
                options.Cookie.HttpOnly = true;

                // 🔥 ВАЖНО
                options.Cookie.SameSite = SameSiteMode.None;
                options.Cookie.SecurePolicy = CookieSecurePolicy.Always;

                options.ExpireTimeSpan = TimeSpan.FromMinutes(10);
            }) // только для Google handshake
            .AddGoogle(GoogleDefaults.AuthenticationScheme, options =>
            {
                options.ClientId = builder.Configuration["Google:ClientId"];
                options.ClientSecret = builder.Configuration["Google:ClientSecret"];
                options.CallbackPath = "/api/auth/google-callback";
                
                options.SignInScheme = CookieAuthenticationDefaults.AuthenticationScheme; // для Google
                
                options.Scope.Add("profile");
                options.Scope.Add("email");
            });
    }
}
