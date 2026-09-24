using Filmograf.BaseLibrary.Integrations;
using Filmograf.BaseLibrary.Integrations.Requested;
using Filmograf.BaseLibrary.Services;
using Filmograf.SearchIndexerService.Integration.Hosted;
using Filmograf.SearchIndexerService.Services.Integrations;

namespace Filmograf.SearchIndexerService.Extendions;

internal static class RabbitExtension
{
    public static IServiceCollection AddRabbitMQ(this IServiceCollection services)
    {
        // rabbitqm hosted service
        services.AddHostedService<RabbitMqHostedShell>();
        
        // rabbitqm requests service
        services.AddSingleton<IRabbitMqRequestedService, RabbitMqRequestedServiceShell>();
        
        // integration contexts
        services.AddScoped<IntegrationContextBase>();
        services.AddScoped<PickMovieUpdateIntegrationContext>();
        
        return services;
    }
}