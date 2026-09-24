using Filmograf.BaseLibrary.Integrations;
using Filmograf.BaseLibrary.Integrations.Requested;
using Filmograf.SearchService.Integration.Hosted;
using Filmograf.SearchService.Services.Integrations;

namespace Filmograf.SearchService.Extensions;

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
        services.AddScoped<ReceiveParsingResultIntegrationContext>();

        return services;
    }
}