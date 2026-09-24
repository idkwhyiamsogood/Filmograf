using Filmograf.BaseLibrary.DataAccess.Repositories;
using Filmograf.BaseLibrary.Models.Repo;
using MongoDB.Driver;

namespace Filmograf.SearchIndexerService.Services.Hosted;

public class MongoIndexService : IHostedService
{
    private readonly IMongoCollection<MoviesClicksAnalyticRepo> _movieClicks;
    private readonly IMongoCollection<CollectionClicksAnalyticRepo> _collectionClicks;

    public MongoIndexService(IMongoDatabase database)
    {
        _movieClicks = database.GetCollection<MoviesClicksAnalyticRepo>(MoviesClicksAnalyticRepository.CollectionName);
        _collectionClicks = database.GetCollection<CollectionClicksAnalyticRepo>(CollectionsClicksAnalyticRepository.CollectionName);
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        try
        {
            await _movieClicks.Indexes.CreateManyAsync(new[]
            {
                new CreateIndexModel<MoviesClicksAnalyticRepo>(
                    Builders<MoviesClicksAnalyticRepo>.IndexKeys
                        .Ascending(x => x.MovieId)
                ),
                new CreateIndexModel<MoviesClicksAnalyticRepo>(
                    Builders<MoviesClicksAnalyticRepo>.IndexKeys
                        .Ascending(x => x.TargetDate)
                ),
                new CreateIndexModel<MoviesClicksAnalyticRepo>(
                    Builders<MoviesClicksAnalyticRepo>.IndexKeys
                        .Ascending(x => x.MovieId)
                        .Ascending(x => x.TargetDate)
                )
            }, cancellationToken);


            await _collectionClicks.Indexes.CreateManyAsync(new[]
            {
                new CreateIndexModel<CollectionClicksAnalyticRepo>(
                    Builders<CollectionClicksAnalyticRepo>.IndexKeys
                        .Ascending(x => x.CollectionId)
                ),
                new CreateIndexModel<CollectionClicksAnalyticRepo>(
                    Builders<CollectionClicksAnalyticRepo>.IndexKeys
                        .Ascending(x => x.TargetDate)
                ),
                new CreateIndexModel<CollectionClicksAnalyticRepo>(
                    Builders<CollectionClicksAnalyticRepo>.IndexKeys
                        .Ascending(x => x.CollectionId)
                        .Ascending(x => x.TargetDate)
                )
            }, cancellationToken);
        }
        catch (Exception ex)
        {
            // todo логи добавь, забал
            Console.WriteLine($"Ошибка при создании индексов: {ex.Message}");
        }
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}