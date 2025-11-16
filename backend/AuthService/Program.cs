using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.OpenApi.Models;
using StackExchange.Redis;
using Filmograf.AuthService.Services;
using Filmograf.AuthService.Services.Authentication;
using Filmograf.AuthService.Util;

namespace Filmograf.AuthService;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        AppSettingsUtil.LoadAppSettingsData();
        
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

        app.UseCors("AllowAll"); // todo: в проде поменять
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
                    policy.WithOrigins("http://localhost:3000")
                        .AllowAnyHeader()
                        .AllowAnyMethod();
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
        
        builder.Services.AddScoped<Services.AuthService>();
        builder.Services.AddScoped<TokenService>();
        builder.Services.AddScoped<RedisService>();
    }

    private static void SettingUpAuthenticationService(WebApplicationBuilder builder)
    {
        builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = S5kAuthSchemeOptions.SchemeName;
                options.DefaultChallengeScheme = S5kAuthSchemeOptions.SchemeName;
            })
            .AddScheme<S5kAuthSchemeOptions, S5kAuthHandler>(
                S5kAuthSchemeOptions.SchemeName, 
                options => { });
    }
}
