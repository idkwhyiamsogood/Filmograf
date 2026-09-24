using System.Linq.Expressions;
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
    
    public Task<IAsyncCursor<TBase>> GetCursorAsync(CancellationToken ct = default)
    {
        Expression<Func<TBase, bool>> defaultFilter = _ => true;
        return GetCursorAsync(defaultFilter, ct);
    }
    
    public Task<IAsyncCursor<TBase>> GetCursorAsync(Expression<Func<TBase, bool>> filter, CancellationToken ct = default)
    {
        return _collection.Find(filter)
            .ToCursorAsync(cancellationToken: ct);
    }
    
    public async Task<TBase?> GetByIdAsync(string id, CancellationToken ct = default)
    {
        var filter = Builders<TBase>.Filter.Eq("_id", ObjectId.Parse(id));
        return await _collection.Find(filter).FirstOrDefaultAsync(ct);
    }
    
    public async Task<IReadOnlyList<TBase>> GetByIdsAsync(IEnumerable<string> ids, CancellationToken ct = default)
    {
        if (ids == null || !ids.Any()) return new List<TBase>();
        var objectIds = ids.Select(id => ObjectId.Parse(id)).ToList();
        
        var filter = Builders<TBase>.Filter.In("_id", objectIds);
        return await _collection.Find(filter).ToListAsync(ct);
    }
    
    public async Task<IReadOnlyList<TBase>> GetAllAsync(CancellationToken ct = default)
    {
        return await _collection.Find(_ => true).ToListAsync(ct);
    }
    
    public async Task<IReadOnlyList<TBase>> GetAllAsync(int skip, int limit, CancellationToken ct = default)
    {
        return await _collection.Find(_ => true)
            .Skip(skip)
            .Limit(limit)
            .ToListAsync(ct);
    }
    
    public async Task<string> CreateAsync(TBase item, CancellationToken ct = default)
    {
        await _collection.InsertOneAsync(item, ct);
        return item.Id ?? string.Empty;
    }
    
    public async Task<bool> UpdateAsync(string id, TBase item, CancellationToken ct = default)
    {
        var filter = Builders<TBase>.Filter.Eq("_id", ObjectId.Parse(id));
        item.LastUsedAt = DateTime.UtcNow;
        item.UpdateDate = DateTime.UtcNow;
        var result = await _collection.ReplaceOneAsync(filter, item, cancellationToken: ct);
        return result.ModifiedCount > 0;
    }

    public async Task<bool> UpdateManipulationAsync(string id, Func<TBase, CancellationToken, Task> manipulation, 
        CancellationToken ct = default)
    {
        var filter = Builders<TBase>.Filter.Eq("_id", ObjectId.Parse(id));
        var item = await _collection.Find(filter).FirstOrDefaultAsync(ct);
        if (item == null) return false;
        
        item.LastUsedAt = DateTime.UtcNow;

        await manipulation(item, ct);
        
        item.UpdateDate = DateTime.UtcNow;
        await _collection.ReplaceOneAsync(filter, item, cancellationToken: ct);
        return true;
    }

    public async Task<bool> DeleteAsync(string id, CancellationToken ct = default)
    {
        var filter = Builders<TBase>.Filter.Eq("_id", ObjectId.Parse(id));
        var result = await _collection.DeleteOneAsync(filter, cancellationToken: ct);
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