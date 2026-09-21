using System.Text;
using Filmograf.BaseLibrary.Caching;
using Filmograf.BaseLibrary.DataAccess.DbContext;
using Filmograf.BaseLibrary.DataAccess.Providers;
using Filmograf.BaseLibrary.DataAccess.Repositories;
using Filmograf.BaseLibrary.Integrations;
using Filmograf.BaseLibrary.Integrations.Requested;
using Filmograf.BaseLibrary.Models.Context;
using Filmograf.BaseLibrary.Services;
using Filmograf.BaseLibrary.Util;
using Filmograf.CollectionsService.Caching;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.OpenApi.Models;
using StackExchange.Redis;

using Filmograf.CollectionsService.Services;
using Filmograf.CollectionsService.Services.Integrations;
using Filmograf.CollectionsService.Services.Middlewares;
using Filmograf.CollectionsService.Services.Tags;
using Filmograf.CollectionsService.Util;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Filmograf.CollectionsService;

public class Program
{
    public async static Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        AppSettingsUtil.LoadAppSettingsData();
        LocalAppSettingsUtil.LoadAppSettingsData();
        
        // Add services to the container.
        builder.Services.AddControllers();
        builder.Services.AddEndpointsApiExplorer();
        
        // Add AutoMapper
        builder.Services.AddAutoMapper(_ => { }, typeof(Program).Assembly);
        builder.Services.AddSwaggerGen();
        
        SettingUpSwagger(builder);
        SettingUpCors(builder);
        SettingUpRedis(builder);
        SettingUpMongoDB(builder);
        SettingRabbitMQ(builder);
        SettingComponents(builder);
        SettingUpAuthenticationService(builder);
        
        var app = builder.Build();
        
        // ловушка для ошибок
        app.UseMiddleware<ExceptionHandlingMiddleware>();

        // Configure the HTTP request pipeline.
        if (AppSettingsUtil.AppSettings.DevMode)
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
                Description = "Введите ваш JWT токен",
                Name = "Authorization",
                In = ParameterLocation.Header,
                Type = SecuritySchemeType.Http,
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
                    policy.WithOrigins(
                            AppSettingsUtil.AppSettings.OriginSettings.FrontendOrigin.Split(";")
                        )
                        .AllowAnyHeader()
                        .AllowAnyMethod().AllowCredentials();
                });
        });
    }
    
    private static void SettingUpRedis(WebApplicationBuilder builder)
    {
        var redisSettings = AppSettingsUtil.AppSettings.RedisSettings;
        Console.WriteLine(redisSettings.Host);
        
        builder.Services.AddSingleton<IConnectionMultiplexer>(sp => 
            ConnectionMultiplexer.Connect($"{redisSettings.Host}:6379,abortConnect=false"));
    }
    
    private static void SettingUpMongoDB(WebApplicationBuilder builder)
    {
        var mongoDbSettings = AppSettingsUtil.AppSettings.MongoDbSettings;
        
        // mongoDB из коробки не понимает что надо хранить Guid в стандартном формате (Standard UUID)
        var serializer = new MongoDB.Bson.Serialization.Serializers.GuidSerializer(GuidRepresentation.Standard);
        MongoDB.Bson.Serialization.BsonSerializer.RegisterSerializer(serializer);

        builder.Services.AddSingleton<IMongoDatabase>(serviceProvider =>
        {
            var client = new MongoClient(mongoDbSettings.ConnectionString);
            return client.GetDatabase(mongoDbSettings.DatabaseName);
        });

        builder.Services.AddScoped<MovieRepository>();
        builder.Services.AddHostedService<MongoIndexService>();
    }
    
    private static void SettingRabbitMQ(WebApplicationBuilder builder)
    {
        // rabbitqm hosted service
        builder.Services.AddHostedService<RabbitMqHostedShell>();
        
        // rabbitqm requests service
        builder.Services.AddSingleton<IRabbitMqRequestedService, RabbitMqRequestedServiceShell>();
        
        // integration contexts
        builder.Services.AddScoped<IntegrationContextBase>();
        // builder.Services.AddScoped<FilmsDistinctIntegrationContext>();
        // builder.Services.AddScoped<FilmsApplyDetailsIntegrationContext>();
        // builder.Services.AddScoped<CompleteParsingIntegrationContext>();
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
        builder.Services.AddScoped<RedisService>();
        builder.Services.AddScoped<AuthValidationService>();
        builder.Services.AddScoped<UserService>();
        builder.Services.AddScoped<CollectionTagService>();
        builder.Services.AddScoped<CollectionService>();
        builder.Services.AddScoped<ClickEntityService>();
        builder.Services.AddScoped<PersonalizedService>();
        builder.Services.AddScoped<CollectionsChartService>();
        builder.Services.AddScoped<CollectionTopPicksService>();
        builder.Services.AddScoped<TopPicksService>();
        builder.Services.AddScoped<MissionPlannerService>();
        builder.Services.AddScoped<TopPicksRepository>();
        builder.Services.AddScoped<MissionPlannerCache>();
        builder.Services.AddScoped<TopPickCaching>();
        builder.Services.AddScoped<CollectionPinService>();
        
        // providers
        builder.Services.AddScoped<GenreProvider>();
        builder.Services.AddScoped<AuthProvider>();
        builder.Services.AddScoped<UserProvider>();
        builder.Services.AddScoped<CollectionTagProvider>();
        
        // repositories
        builder.Services.AddScoped<CollectionRepository>();
        builder.Services.AddScoped<CollectionPinRepository>();
        
        // cache
        builder.Services.AddScoped<UserCaching>();
        builder.Services.AddScoped<CollectionTagsCaching>();
        builder.Services.AddScoped<CollectionPinsCaching>();
        builder.Services.AddScoped<CollectionsCaching>();
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
