using Filmograf.BaseLibrary.DataAccess.Repositories;
using Filmograf.BaseLibrary.Integrations;
using Filmograf.BaseLibrary.Integrations.Requested;
using Filmograf.BaseLibrary.Services;
using Filmograf.BaseLibrary.Util;
using Filmograf.AnalyticsService.Caching;
using Filmograf.AnalyticsService.DataAccess.Repositories;
using Filmograf.AnalyticsService.Integration.Hosted;
using StackExchange.Redis;

using Filmograf.AnalyticsService.Services;
using Filmograf.AnalyticsService.Services.Charts;
using Filmograf.AnalyticsService.Services.Integrations;
using Filmograf.AnalyticsService.Services.Middlewares;
using Filmograf.AnalyticsService.Services.Personalized;
using Filmograf.AnalyticsService.Services.ViewsCounting;
using Filmograf.AnalyticsService.Util;
using Filmograf.BaseLibrary.Caching;
using Filmograf.BaseLibrary.DataAccess.Serializers;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Filmograf.AnalyticsService;

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
        builder.Services.AddSwaggerGen();
        
        // Add AutoMapper
        builder.Services.AddAutoMapper(_ => { }, typeof(Program).Assembly);
        
        SettingUpRedis(builder);
        SettingUpMongoDB(builder);
        SettingRabbitMQ(builder);
        SettingComponents(builder);
        
        var app = builder.Build();
        
        // ловушка для ошибок
        app.UseMiddleware<ExceptionHandlingMiddleware>();

        // Configure the HTTP request pipeline.
        if (AppSettingsUtil.AppSettings.DevMode)
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
        var guidSerializer = new MongoDB.Bson.Serialization.Serializers.GuidSerializer(GuidRepresentation.Standard);
        MongoDB.Bson.Serialization.BsonSerializer.RegisterSerializer(guidSerializer);
        
        // с date only этот еблан тоже не дружит
        var dateOnlySerializer = new DateOnlySerializer();
        MongoDB.Bson.Serialization.BsonSerializer.RegisterSerializer(dateOnlySerializer);

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
        builder.Services.AddScoped<ClickEntityIntegrationContext>();
        builder.Services.AddScoped<CompileChartIntegrationContext>();
        builder.Services.AddScoped<CompilePersonalizedIntegrationContext>();
    }

    private static void SettingComponents(WebApplicationBuilder builder)
    {
        // contexts
        // ...
        
        // services
        builder.Services.AddScoped<RedisService>();
        builder.Services.AddScoped<ClicksService>();
        builder.Services.AddScoped<MovieClicksService>();
        builder.Services.AddScoped<CollectionClicksService>();
        builder.Services.AddScoped<ClickIntervalValidator>();
        builder.Services.AddScoped<MoviesChartService>();
        builder.Services.AddScoped<ChartService>();
        builder.Services.AddScoped<TopPicksService>();
        builder.Services.AddScoped<PersonalizedService>();
        builder.Services.AddScoped<MoviesPersonalizedService>();
        builder.Services.AddScoped<CollectionsChartService>();
        builder.Services.AddScoped<CollectionsPersonalizedService>();
        builder.Services.AddScoped<CollectionViewsCountingService>();
        builder.Services.AddScoped<MovieViewsCountingService>();
        builder.Services.AddScoped<MissionPlannerService>();
        
        // providers
        // ...
        
        // repositories
        builder.Services.AddScoped<MoviesClicksAnalyticRepository>();
        builder.Services.AddScoped<UserMoviesActivityDailyRepository>();
        builder.Services.AddScoped<CollectionsClicksAnalyticRepository>();
        builder.Services.AddScoped<UserCollectionsActivityDailyRepository>();
        builder.Services.AddScoped<TopPicksRepository>();
        builder.Services.AddScoped<MovieRepository>(); // да, тут немного теряем SRP (Single Responsibility Principle)
        builder.Services.AddScoped<CollectionRepository>(); // и тут немного теряем SRP)
        
        // cache
        builder.Services.AddScoped<ClickEntityCaching>();
        builder.Services.AddScoped<MoviesCaching>();
        builder.Services.AddScoped<CollectionsCaching>();
        builder.Services.AddScoped<TopPickCaching>();
        builder.Services.AddScoped<MissionPlannerCache>();
    }
}
