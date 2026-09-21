using Filmograf.BaseLibrary.Models.Dto;
using Filmograf.BaseLibrary.Models.Repo;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Filmograf.BaseLibrary.DataAccess.Repositories;

public abstract class RepositoryBase<TBase> where TBase : RepoBase
{
    protected readonly IMongoCollection<TBase> _collection;

    protected RepositoryBase(IMongoDatabase database, string collectionName)
    {
        _collection = database.GetCollection<TBase>(collectionName);
    }
    
    public async Task<TBase?> GetByIdAsync(string id)
    {
        var filter = Builders<TBase>.Filter.Eq("_id", ObjectId.Parse(id));
        return await _collection.Find(filter).FirstOrDefaultAsync();
    }
    
    public async Task<IReadOnlyList<TBase>> GetByIdsAsync(IEnumerable<string> ids)
    {
        if (ids == null || !ids.Any()) return new List<TBase>();
        var objectIds = ids.Select(id => ObjectId.Parse(id)).ToList();
        
        var filter = Builders<TBase>.Filter.In("_id", objectIds);
        return await _collection.Find(filter).ToListAsync();
    }
    
    public async Task<IReadOnlyList<TBase>> GetAllAsync()
    {
        return await _collection.Find(_ => true).ToListAsync();
    }
    
    public async Task<IReadOnlyList<TBase>> GetAllAsync(int skip, int limit)
    {
        return await _collection.Find(_ => true)
            .Skip(skip)
            .Limit(limit)
            .ToListAsync();
    }
    
    public async Task<string> CreateAsync(TBase item)
    {
        await _collection.InsertOneAsync(item);
        return item.Id ?? string.Empty;
    }
    
    public async Task<bool> UpdateAsync(string id, TBase item)
    {
        var filter = Builders<TBase>.Filter.Eq("_id", ObjectId.Parse(id));
        item.LastUsedAt = DateTime.UtcNow;
        item.UpdateDate = DateTime.UtcNow;
        var result = await _collection.ReplaceOneAsync(filter, item);
        return result.ModifiedCount > 0;
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var filter = Builders<TBase>.Filter.Eq("_id", ObjectId.Parse(id));
        var result = await _collection.DeleteOneAsync(filter);
        return result.DeletedCount > 0;
    }
    
    /// <summary>
    /// Возвращает один случайный документ из коллекции.
    /// </summary>
    public async Task<TBase?> GetRandomAsync(CancellationToken ct = default)
    {
        return await _collection.Aggregate()
            .Sample(1)
            .FirstOrDefaultAsync(ct);
    }

    /// <summary>
    /// Возвращает список из N случайных документов.
    /// </summary>
    public async Task<IReadOnlyList<TBase>> GetRandomManyAsync(int count, CancellationToken ct = default)
    {
        if (count <= 0) return new List<TBase>();

        return await _collection.Aggregate()
            .Sample(count)
            .ToListAsync(ct);
    }
}