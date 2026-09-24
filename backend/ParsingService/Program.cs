using System.Text;
using Filmograf.BaseLibrary.DataAccess.DbContext;
using Filmograf.BaseLibrary.Integrations;
using Filmograf.BaseLibrary.Integrations.Requested;
using Filmograf.BaseLibrary.Models.Context;
using Filmograf.BaseLibrary.Services;
using Filmograf.BaseLibrary.Util;
using Filmograf.ParsingService.Integration.Hosted;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.OpenApi.Models;
using StackExchange.Redis;

using Filmograf.ParsingService.Services;
using Filmograf.ParsingService.Services.IMDb;
using Filmograf.ParsingService.Services.Integrations;
using Filmograf.ParsingService.Services.Kinogo;
using Filmograf.ParsingService.Services.Kinopoisk;
using Filmograf.ParsingService.Services.Middlewares;
using Filmograf.ParsingService.Util;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

namespace Filmograf.ParsingService;

public class Program
{
    public async static Task Main(string[] args)
    {
        var builder = Host.CreateApplicationBuilder(args);

        AppSettingsUtil.LoadAppSettingsData();
        
        // Add services to the container.
        builder.Services.AddControllers();
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();
        
        // SettingUpSwagger(builder);
        // SettingUpCors(builder);
        SettingUpRedis(builder);
        SettingRabbitMQ(builder);
        SettingComponents(builder);
        // SettingUpAuthenticationService(builder);
        
        var app = builder.Build();
        
        await app.RunAsync();
    }
    
    private static void SettingUpSwagger(HostApplicationBuilder builder)
    {
        builder.Services.AddSwaggerGen(c =>
        {
            c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                Description = "Введите ваш JWT токен",
                Name = "Authorization",
                In = ParameterLocation.Header,
                Type = SecuritySchemeType.ApiKey,
                Scheme = "Bearer"
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
            options.AddPolicy("AllowAll",
                policy =>
                {
                    policy.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader();
                });

            options.AddPolicy("AllowFrontend",
                policy => 
                {
                    policy.WithOrigins(AppSettingsUtil.AppSettings.OriginSettings.FrontendOrigin)
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                });
        });
    }
    
    private static void SettingUpRedis(HostApplicationBuilder builder)
    {
        var redisSettings = AppSettingsUtil.AppSettings.RedisSettings;
        Console.WriteLine(redisSettings.Host);
        
        builder.Services.AddSingleton<IConnectionMultiplexer>(sp => 
            ConnectionMultiplexer.Connect($"{redisSettings.Host}:6379,abortConnect=false"));
    }
    
    private static void SettingRabbitMQ(HostApplicationBuilder builder)
    {
        // rabbitqm hosted service
        builder.Services.AddHostedService<RabbitMqHostedShell>();
        
        // rabbitqm requests service
        builder.Services.AddSingleton<IRabbitMqRequestedService, RabbitMqRequestedServiceShell>();
        
        // integration contexts
        builder.Services.AddScoped<IntegrationContextBase>();
        builder.Services.AddScoped<ParseMoviesIntegrationContext>();
        builder.Services.AddScoped<ParseMoviesDetailsIntegrationContext>();
        builder.Services.AddScoped<ParseOneMovieDetailsIntegrationContext>();
        builder.Services.AddScoped<ParseSearchingIntegrationContext>();
    }

    private static void SettingComponents(HostApplicationBuilder builder)
    {
        // common utils
        builder.Services.AddTransient<FileExtensionContentTypeProvider>();
        
        // database contexts
        builder.Services.AddScoped<DbContextBase>();
        
        // contexts
        builder.Services.AddScoped<AuthContext>();
        
        // services
        builder.Services.AddScoped<RedisService>();
        builder.Services.AddScoped<MoviesParserService>();
        builder.Services.AddScoped<IMDbParserService>();
        builder.Services.AddScoped<IMDbDetailsParserService>();
        builder.Services.AddScoped<KinopoiskParserService>();
        builder.Services.AddScoped<IMDbOneMovieParserService>();
        builder.Services.AddScoped<SearchService>();
        builder.Services.AddScoped<KinogoSearchService>();
        
        // providers
        // ...
        
        // cache
        // ...
    }

    private static void SettingUpAuthenticationService(WebApplicationBuilder builder)
    {
        // Добавляем AuthorizationMiddleware в Scoped
        builder.Services.AddScoped<AuthorizationMiddleware>();
        
        // Настройка авторизации через JWT
        var jwtSecret = AppSettingsUtil.AppSettings.SecretsSettings.JwtSecret;
        var validIssuer = AppSettingsUtil.AppSettings.SecretsSettings.JwtValidIssuer;
        var validAudience = AppSettingsUtil.AppSettings.SecretsSettings.JwtValidAudience;
        var key = Encoding.UTF8.GetBytes(jwtSecret);
        builder.Services
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
    }
}
