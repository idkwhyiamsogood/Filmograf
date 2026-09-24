using Filmograf.AnalyticsService.Integration.Hosted;
using Filmograf.AnalyticsService.Services.Integrations;
using Filmograf.BaseLibrary.Integrations;
using Filmograf.BaseLibrary.Integrations.Requested;

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
        services.AddScoped<ClickEntityIntegrationContext>();
        services.AddScoped<CompileChartIntegrationContext>();
        services.AddScoped<CompilePersonalizedIntegrationContext>();
        
        return services;
    }
}