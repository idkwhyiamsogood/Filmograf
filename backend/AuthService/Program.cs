using System.Text;
using Filmograf.BaseLibrary.Caching;
using Filmograf.BaseLibrary.DataAccess.DbContext;
using Filmograf.BaseLibrary.DataAccess.Providers;
using Filmograf.BaseLibrary.Models.Context;
using Filmograf.BaseLibrary.Services;
using Filmograf.BaseLibrary.Util;
using Filmograf.MoviesService.Caching;
using Filmograf.MoviesService.Services;
using Filmograf.MoviesService.Services.Middlewares;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.OpenApi.Models;
using StackExchange.Redis;

using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.HttpOverrides;
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
        
        // Add AutoMapper
        builder.Services.AddAutoMapper(_ => { }, typeof(Program).Assembly);
        
        // builder.Services.Configure<ForwardedHeadersOptions>(options =>
        // {
        //     options.ForwardedHeaders = ForwardedHeaders.XForwardedProto | ForwardedHeaders.XForwardedHost;
        //     options.KnownNetworks.Clear();
        //     options.KnownProxies.Clear();
        // });
        
        SettingUpSwagger(builder);
        SettingUpCors(builder);
        SettingUpContexts(builder);
        SettingUpRedis(builder);
        SettingComponents(builder);
        SettingUpAuthenticationService(builder);
        
        var app = builder.Build();
        
        // ловушка для ошибок
        app.UseMiddleware<ExceptionHandlingMiddleware>();
        
        // наебалово для nginx
        if (AppSettingsUtil.AppSettings.HttpsForwardedHeaders)
        {
            app.UseForwardedHeaders(new ForwardedHeadersOptions
            {
                ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
            });
        }

        // Configure the HTTP request pipeline.
        if (AppSettingsUtil.AppSettings.DevMode)
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseCors("AllowFrontend");
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
            //             .AllowAnyMethod()
            //             .AllowAnyHeader();
            //     });

            options.AddPolicy("AllowFrontend",
                policy =>
                {
                    var kek = AppSettingsUtil.AppSettings.OriginSettings.FrontendOrigin.Split(";");
                    policy.WithOrigins(
                            kek
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
        
        // contexts
        builder.Services.AddScoped<AuthContext>();
        
        // services
        builder.Services.AddScoped<JwtService>();
        builder.Services.AddScoped<GoogleO2AuthService>();
        builder.Services.AddScoped<UserService>();
        builder.Services.AddScoped<AuthValidationService>();
        builder.Services.AddScoped<GoogleO2IdempotenceService>();
        builder.Services.AddScoped<BotProtectionService>();
        builder.Services.AddScoped<TemporaryAuthService>();
        builder.Services.AddScoped<CommonAuthService>();
        
        // providers
        builder.Services.AddScoped<AuthProvider>();
        builder.Services.AddScoped<UserProvider>();
        
        // cache
        builder.Services.AddScoped<GoogleO2IdempotenceCaching>();
        builder.Services.AddScoped<UserCaching>();
        builder.Services.AddScoped<TemporaryGuardCaching>();
    }

    private static void SettingUpAuthenticationService(WebApplicationBuilder builder)
    {
        // Добавляем AuthorizationMiddleware в Scoped
        builder.Services.AddScoped<AuthorizationMiddleware>();
        
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
                var googleO2Settings = AppSettingsUtil.AppSettings.GoogleO2AuthSettings;
                
                options.ClientId = googleO2Settings.ClientId;
                options.ClientSecret = googleO2Settings.ClientSecret;
                // options.CallbackPath = "/api/auth/google-callback";
                
                options.SignInScheme = CookieAuthenticationDefaults.AuthenticationScheme; // для Google
                
                options.Scope.Add("profile");
                options.Scope.Add("email");
                
                options.ClaimActions.MapJsonKey("picture", "picture");
            });
    }
}
