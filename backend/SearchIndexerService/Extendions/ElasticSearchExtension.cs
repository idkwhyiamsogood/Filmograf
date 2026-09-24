using Elastic.Clients.Elasticsearch;
using Elastic.Transport;

using Filmograf.BaseLibrary.Util;
using Filmograf.SearchIndexerService.Services.Hosted;

namespace Filmograf.SearchIndexerService.Extendions;

internal static class ElasticSearchExtension
{
    public static IServiceCollection AddElastic(this IServiceCollection services)
    {
        var elasticSettings = AppSettingsUtil.AppSettings.ElasticSettings;
        
        services.AddSingleton<ElasticsearchClient>(sp =>
        {
            var settings = new ElasticsearchClientSettings(new Uri(elasticSettings.Uri))
                .Authentication(new BasicAuthentication(elasticSettings.Username, elasticSettings.Password))
                // для локальной разработки на самоподписанных сертификатах
                .ServerCertificateValidationCallback(CertificateValidations.AllowAll);

            return new ElasticsearchClient(settings);
        });
        
        services.AddHostedService<ElasticIndexInitializer>();
        services.AddHostedService<SearchIndexBootstrap>();

        return services;
    }
}