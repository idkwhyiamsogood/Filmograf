using Filmograf.AnalyticsService.Models.Repo;
using Filmograf.BaseLibrary.DataAccess.Repositories;
using MongoDB.Driver;

namespace Filmograf.AnalyticsService.DataAccess.Repositories;

public class CollectionsClicksAnalyticRepository : RepositoryBase<CollectionClicksAnalyticRepo>
{
    public static readonly string CollectionName = "collection_clicks";
    
    public CollectionsClicksAnalyticRepository(IMongoDatabase database) : base(database, CollectionName)
    {
    }

    public async Task<IEnumerable<CollectionClicksAnalyticRepo>> ListByCollectionAsync(string collectionId, CancellationToken ct = default)
    {
        var filter = Builders<CollectionClicksAnalyticRepo>.Filter
            .Eq(x => x.CollectionId, collectionId);
    
        return await _collection.Find(filter)
            .ToListAsync(ct);
    }

    public async Task<long> CountClicksByCollectionAsync(string collectionId, CancellationToken ct = default)
    {
        // фильтруем документы по MovieId
        var filter = Builders<CollectionClicksAnalyticRepo>.Filter
            .Eq(x => x.CollectionId, collectionId);

        // группируем и суммируем поле Count
        var result = await _collection.Aggregate()
            .Match(filter) // Эквивалент WHERE
            .Group(x => x.CollectionId, g => 
                new { Total = g.Sum(x => x.Count) }) // Суммируем
            .FirstOrDefaultAsync(ct);

        // Если документов по фильтру нет, result будет null, возвращаем 0
        return result?.Total ?? 0;
    }
    
    public async Task<CollectionClicksAnalyticRepo?> GetByCollectionAndDateAsync(string collectionId, DateOnly date, CancellationToken ct = default)
    {
        var filter = Builders<CollectionClicksAnalyticRepo>.Filter.And(
            Builders<CollectionClicksAnalyticRepo>.Filter.Eq(x => x.CollectionId, collectionId),
            Builders<CollectionClicksAnalyticRepo>.Filter.Eq(x => x.TargetDate, date)
        );

        return await _collection.Find(filter).FirstOrDefaultAsync(ct);
    }

    public async Task<List<CollectionClicksAnalyticRepo>> GetByCollectionAndPeriodAsync(string collectionId, DateOnly from, 
        DateOnly to, CancellationToken ct = default)
    {
        var filter = Builders<CollectionClicksAnalyticRepo>.Filter.And(
            Builders<CollectionClicksAnalyticRepo>.Filter
                .Eq(x => x.CollectionId, collectionId),
            
            Builders<CollectionClicksAnalyticRepo>.Filter
                .Gte(x => x.TargetDate, from),
            
            Builders<CollectionClicksAnalyticRepo>.Filter
                .Lte(x => x.TargetDate, to)
        );

        return await _collection.Find(filter)
            .SortBy(x => x.TargetDate)
            .ToListAsync(ct);
    }
    
    public async Task<List<CollectionClicksAnalyticRepo>> GetByPeriodAsync(DateOnly from, DateOnly to, CancellationToken ct = default)
    {
        var filter = Builders<CollectionClicksAnalyticRepo>.Filter.And(
            Builders<CollectionClicksAnalyticRepo>.Filter
                .Gte(x => x.TargetDate, from),
            
            Builders<CollectionClicksAnalyticRepo>.Filter
                .Lte(x => x.TargetDate, to)
        );

        return await _collection.Find(filter)
            .SortBy(x => x.TargetDate)
            .ToListAsync(ct);
    }
    
    public async Task IncrementClickAsync(string collectionId, DateOnly date, CancellationToken ct = default)
    {
        var filter = Builders<CollectionClicksAnalyticRepo>.Filter.And(
            Builders<CollectionClicksAnalyticRepo>.Filter.Eq(x => x.CollectionId, collectionId),
            Builders<CollectionClicksAnalyticRepo>.Filter.Eq(x => x.TargetDate, date)
        );

        var update = Builders<CollectionClicksAnalyticRepo>.Update
            .Inc(x => x.Count, 1)
            .SetOnInsert(x => x.CollectionId, collectionId)
            .SetOnInsert(x => x.TargetDate, date);
    
        await _collection.UpdateOneAsync(filter, update, new UpdateOptions { IsUpsert = true }, ct);
    }
}