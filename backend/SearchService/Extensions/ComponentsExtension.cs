using Filmograf.BaseLibrary.Caching;
using Filmograf.BaseLibrary.DataAccess.DbContext;
using Filmograf.BaseLibrary.DataAccess.Providers;
using Filmograf.BaseLibrary.DataAccess.Repositories;
using Filmograf.BaseLibrary.Models.Context;
using Filmograf.BaseLibrary.Services;
using Filmograf.SearchService.Caching;
using Filmograf.SearchService.DataAccess.IndexProviders;
using Filmograf.SearchService.Services;

namespace Filmograf.SearchService.Extensions;

internal static class ComponentsExtension
{
    public static IServiceCollection AddComponents(this IServiceCollection services)
    {
        // common utils
        // ...
        
        // database contexts
        services.AddScoped<DbContextBase>();
        
        // contexts
        services.AddScoped<AuthContext>();
        
        // services
        services.AddScoped<RedisService>();
        services.AddScoped<AuthValidationService>();
        services.AddScoped<UserService>();
        services.AddScoped<SearchMovieService>();
        services.AddScoped<SearchCollectionService>();
        services.AddScoped<SearchTagService>();
        services.AddScoped<SearchGenreService>();
        services.AddScoped<SearchParsingReceiverService>();
        services.AddScoped<SearchParsingService>();
        
        // providers
        services.AddScoped<AuthProvider>();
        services.AddScoped<UserProvider>();
        services.AddScoped<CollectionTagProvider>();
        services.AddScoped<GenreProvider>();
        
        // index providers
        services.AddSingleton<MovieSearchIndexProvider>();
        
        // repositories
        services.AddScoped<MovieRepository>();
        services.AddScoped<CollectionRepository>();
        
        // cache
        services.AddScoped<UserCaching>();
        services.AddScoped<SearchCaching>();

        return services;
    }
}