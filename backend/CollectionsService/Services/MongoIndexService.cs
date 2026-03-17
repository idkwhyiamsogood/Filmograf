using Filmograf.BaseLibrary.DataAccess.Repositories;
using Filmograf.BaseLibrary.Models.Repo;
using MongoDB.Driver;

namespace Filmograf.CollectionsService.Services;

public class MongoIndexService : IHostedService
{
    private readonly IMongoCollection<CollectionRepo> _collections;
    private readonly IMongoCollection<CollectionPinRepo> _collectionPins;

    public MongoIndexService(IMongoDatabase database)
    {
        _collections = database.GetCollection<CollectionRepo>(CollectionRepository.CollectionName);
        _collectionPins = database.GetCollection<CollectionPinRepo>(CollectionPinRepository.CollectionName);
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        try
        {
            await _collections.Indexes.CreateManyAsync(new[]
            {
                new CreateIndexModel<CollectionRepo>(
                    Builders<CollectionRepo>.IndexKeys
                        .Ascending(x => x.UserId)
                        .Descending(x => x.CreateDate)
                ),

                new CreateIndexModel<CollectionRepo>(
                    Builders<CollectionRepo>.IndexKeys
                        .Ascending(x => x.Tags)
                ),

                new CreateIndexModel<CollectionRepo>(
                    Builders<CollectionRepo>.IndexKeys
                        .Ascending(x => x.Name)
                ),

                new CreateIndexModel<CollectionRepo>(
                    Builders<CollectionRepo>.IndexKeys
                        .Ascending(x => x.IsPublic)
                ),
            
                new CreateIndexModel<CollectionRepo>(
                    Builders<CollectionRepo>.IndexKeys
                        .Ascending(x => x.IsByFilmograf)
                ),

                new CreateIndexModel<CollectionRepo>(
                    Builders<CollectionRepo>.IndexKeys
                        .Ascending(x => x.SourceCollectionId),
                    new CreateIndexOptions { Sparse = true } // не индексировать null
                )
            }, cancellationToken);
            
            await _collectionPins.Indexes.CreateManyAsync(new[]
            {
                new CreateIndexModel<CollectionPinRepo>(
                    Builders<CollectionPinRepo>.IndexKeys
                        .Ascending(x => x.UserId)
                )
            });
        }
        catch (Exception ex)
        {
            // todo логи добавь, забал
            Console.WriteLine($"Ошибка при создании индексов: {ex.Message}");
        }
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}