using Elastic.Clients.Elasticsearch;
using Filmograf.BaseLibrary.Models.SearchIndexes;

namespace Filmograf.SearchIndexerService.DataAccess.IndexProviders;

public class MovieSearchIndexProvider
{
    private const string IndexName = "movies";
    private readonly ElasticsearchClient _elasticsearch;
    
    public MovieSearchIndexProvider(ElasticsearchClient elasticsearch)
    {
        _elasticsearch = elasticsearch;
    }

    public Task<BulkResponse> IndexMoviesAsync(MovieSearchIndex[] indexes, CancellationToken ct)
    {
        return _elasticsearch.BulkAsync(b => b
            .Index(IndexName)
            .UpdateMany(indexes, (descriptor, movie) => descriptor
                .Doc(movie)
                .DocAsUpsert(true) 
            ),
            cancellationToken: ct
        );
    }
}