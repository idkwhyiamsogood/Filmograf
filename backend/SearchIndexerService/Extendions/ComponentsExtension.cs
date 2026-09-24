using Filmograf.BaseLibrary.Caching;
using Filmograf.BaseLibrary.DataAccess.Repositories;
using Filmograf.BaseLibrary.Services;
using Filmograf.SearchIndexerService.DataAccess.IndexProviders;
using Filmograf.SearchIndexerService.Services;
using Filmograf.SearchIndexerService.Services.Hosted;

namespace Filmograf.SearchIndexerService.Extendions;

internal static class ComponentsExtension
{
    public static IServiceCollection AddComponents(this IServiceCollection services)
    {
        // contexts
        // ...
        
        // services
        services.AddScoped<RedisService>();
        services.AddScoped<MissionPlannerService>();
        services.AddScoped<MovieSearchIndexService>();
        services.AddSingleton<DeferredQueuePickService>();
        services.AddScoped<MoviesReindexService>();
        
        // providers
        // ...
        
        // index providers
        services.AddSingleton<MovieSearchIndexProvider>();
        
        // repositories
        services.AddScoped<MovieRepository>();
        services.AddScoped<CollectionRepository>();
        services.AddScoped<MoviesClicksAnalyticRepository>();
        services.AddScoped<CollectionsClicksAnalyticRepository>();
        
        // cache
        services.AddSingleton<MissionPlannerCache>();
        services.AddSingleton<DeferredQueuePickCaching>();
        
        // hosted
        services.AddHostedService<MoviesReindexBackgroundService>();

        return services;
    }
}