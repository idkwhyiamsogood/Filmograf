using Filmograf.AnalyticsService.Caching;
using Filmograf.AnalyticsService.Services;
using Filmograf.AnalyticsService.Services.Charts;
using Filmograf.AnalyticsService.Services.HistoryBuilding;
using Filmograf.AnalyticsService.Services.Hosted;
using Filmograf.AnalyticsService.Services.Personalized;
using Filmograf.AnalyticsService.Services.RateCounting;
using Filmograf.AnalyticsService.Services.ViewsCounting;
using Filmograf.BaseLibrary.Caching;
using Filmograf.BaseLibrary.DataAccess.Repositories;
using Filmograf.BaseLibrary.Services;

namespace Filmograf.SearchIndexerService.Extendions;

internal static class ComponentsExtension
{
    public static IServiceCollection AddComponents(this IServiceCollection services)
    {
        // contexts
        // ...
        
        // services
        services.AddScoped<RedisService>();
        services.AddScoped<ClicksService>();
        services.AddScoped<MovieClicksService>();
        services.AddScoped<CollectionClicksService>();
        services.AddScoped<ClickIntervalValidator>();
        services.AddScoped<MoviesChartService>();
        services.AddScoped<ChartService>();
        services.AddScoped<TopPicksService>();
        services.AddScoped<PersonalizedService>();
        services.AddScoped<MoviesPersonalizedService>();
        services.AddScoped<CollectionsChartService>();
        services.AddScoped<CollectionsPersonalizedService>();
        services.AddScoped<CollectionViewsCountingService>();
        services.AddScoped<MovieViewsCountingService>();
        services.AddScoped<MissionPlannerService>();
        services.AddScoped<MovieRateCountingService>();
        services.AddScoped<HistoryBuildingService>();
        services.AddScoped<DeferredQueueHistoryBuildingService>();
        services.AddScoped<MoviesHistoryBuildingService>();
        services.AddScoped<CollectionsHistoryBuildingService>();
        services.AddSingleton<DeferredQueuePickService>();
        
        // providers
        // ...
        
        // repositories
        services.AddScoped<MoviesClicksAnalyticRepository>();
        services.AddScoped<UserMoviesActivityDailyRepository>();
        services.AddScoped<CollectionsClicksAnalyticRepository>();
        services.AddScoped<UserCollectionsActivityDailyRepository>();
        services.AddScoped<TopPicksRepository>();
        services.AddScoped<MovieRepository>(); // да, тут немного теряем SRP (Single Responsibility Principle)
        services.AddScoped<CollectionRepository>(); // и тут немного теряем SRP)
        services.AddScoped<MovieRateRepository>();
        
        // cache
        services.AddScoped<ClickEntityCaching>();
        services.AddScoped<MoviesCaching>();
        services.AddScoped<CollectionsCaching>();
        services.AddScoped<TopPickCaching>();
        services.AddScoped<MissionPlannerCache>();
        services.AddSingleton<DeferredQueuePickCaching>();
        
        // hosted
        services.AddHostedService<HistoryBuildingBackgroundService>();

        return services;
    }
}