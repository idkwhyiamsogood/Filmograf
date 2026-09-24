using Elastic.Clients.Elasticsearch;
using Filmograf.BaseLibrary.Models.SearchIndexes;

namespace Filmograf.SearchIndexerService.Services.Hosted;

public class ElasticIndexInitializer : IHostedService
{
    // передаем ElasticsearchClient напрямую через DI, ибо это Singleton, как и IHostedService
    private readonly ElasticsearchClient _elasticsearch;
    
    public ElasticIndexInitializer(ElasticsearchClient elasticsearch)
    {
        _elasticsearch = elasticsearch;
    }
    
    public async Task StartAsync(CancellationToken ct)
    {
        var existsResponse = await _elasticsearch.Indices.ExistsAsync("movies", cancellationToken: ct);
        if (existsResponse.Exists) return;
        
        var createResponse = await _elasticsearch.Indices.CreateAsync("movies", c => c
            .Mappings(m => m
                .Properties<MovieSearchIndex>(p => p
                    .Completion(s => s.NameSuggest)
                    .Text(t => t.Name)
                    .LongNumber(n => n.ViewsCount) 
                    .FloatNumber(f => f.RateIMDb)
                    .FloatNumber(f => f.RateFilmograf)
        
                    .Keyword(k => k.GenreIds) // keyword для точного поиска по ID жанра
                    .IntegerNumber(i => i.Year)
                    .IntegerNumber(i => i.AgeLimit)
                )
            ),
            cancellationToken: ct
        );

        if (!createResponse.IsSuccess()) 
            throw new Exception($"Не удалось создать индекс: {createResponse.DebugInformation}");
        
    }

    public async Task StopAsync(CancellationToken ct)
    {
        return;
    }
}