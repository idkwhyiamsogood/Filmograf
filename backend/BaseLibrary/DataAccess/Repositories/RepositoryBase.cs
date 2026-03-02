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
    
    public async Task<IReadOnlyList<TBase>> GetAllAsync()
    {
        return await _collection.Find(_ => true).ToListAsync();
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
        var result = await _collection.ReplaceOneAsync(filter, item);
        return result.ModifiedCount > 0;
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var filter = Builders<TBase>.Filter.Eq("_id", ObjectId.Parse(id));
        var result = await _collection.DeleteOneAsync(filter);
        return result.DeletedCount > 0;
    }
}