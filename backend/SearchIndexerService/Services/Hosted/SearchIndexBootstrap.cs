namespace Filmograf.SearchIndexerService.Services.Hosted;

public class SearchIndexBootstrap : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    
    public SearchIndexBootstrap(IServiceScopeFactory scopeFactory)
    {
        _scopeFactory = scopeFactory;
    }

    protected override async Task ExecuteAsync(CancellationToken ct)
    {
        using var scope = _scopeFactory.CreateScope();
        var searchIndexServiceType = typeof(MovieSearchIndexService);
        var searchIndexService = scope.ServiceProvider.GetRequiredService(searchIndexServiceType);

        await (searchIndexService as MovieSearchIndexService).ReindexAllMoviesAsync(batchSize: 1000, ct);
    }
}