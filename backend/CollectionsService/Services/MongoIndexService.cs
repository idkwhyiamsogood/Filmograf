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
                // индекс для фильтрации по пользователю + дате + статусу удаления
                new CreateIndexModel<CollectionRepo>(
                    Builders<CollectionRepo>.IndexKeys
                        .Ascending(x => x.UserId)
                        .Descending(x => x.CreateDate)
                        .Ascending(x => x.IsDeleted)
                ),

                // индекс для поиска по тегам с учетом статуса удаления
                new CreateIndexModel<CollectionRepo>(
                    Builders<CollectionRepo>.IndexKeys
                        .Ascending(x => x.Tags)
                        .Ascending(x => x.IsDeleted)
                ),

                // индекс для поиска по имени с учетом статуса удаления
                new CreateIndexModel<CollectionRepo>(
                    Builders<CollectionRepo>.IndexKeys
                        .Ascending(x => x.Name)
                        .Ascending(x => x.IsDeleted)
                ),

                // индекс для публичных коллекций с учетом статуса удаления
                new CreateIndexModel<CollectionRepo>(
                    Builders<CollectionRepo>.IndexKeys
                        .Ascending(x => x.IsPublic)
                        .Descending(x => x.CreateDate)
                        .Ascending(x => x.IsDeleted)
                ),
            
                // индекс для коллекций Filmograf с учетом статуса удаления
                new CreateIndexModel<CollectionRepo>(
                    Builders<CollectionRepo>.IndexKeys
                        .Ascending(x => x.IsByFilmograf)
                        .Descending(x => x.CreateDate)
                        .Ascending(x => x.IsDeleted)
                ),

                // индекс для поиска по SourceCollectionId (с пропуском null)
                new CreateIndexModel<CollectionRepo>(
                    Builders<CollectionRepo>.IndexKeys
                        .Ascending(x => x.SourceCollectionId)
                        .Ascending(x => x.IsDeleted),
                    new CreateIndexOptions { Sparse = true }
                ),
                
                // индекс для быстрого фильтра по IsDeleted (часто используется)
                new CreateIndexModel<CollectionRepo>(
                    Builders<CollectionRepo>.IndexKeys
                        .Ascending(x => x.IsDeleted)
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