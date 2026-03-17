using System.Text.RegularExpressions;
using Filmograf.BaseLibrary.Models.Repo;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Filmograf.BaseLibrary.DataAccess.Repositories;

public class CollectionRepository : RepositoryBase<CollectionRepo>
{
    public static readonly string CollectionName = "collections";
    
    public CollectionRepository(IMongoDatabase database) : base(database, CollectionName)
    {
    }
    
    public Task<List<CollectionRepo>> GetByNameAsync(string name, CancellationToken ct = default)
    {
        var escapedName = Regex.Escape(name);
        
        var filter = Builders<CollectionRepo>.Filter.Regex(x => x.Name, 
            new BsonRegularExpression(escapedName, "i"));
    
        return _collection.Find(filter)
            .ToListAsync(ct);
    }
    
    public Task<List<CollectionRepo>> GetByUserAsync(Guid userId, int skip, int limit, CancellationToken ct = default)
    {
        var filter = Builders<CollectionRepo>.Filter.Eq(x => x.UserId, userId);
    
        return _collection.Find(filter)
            .SortByDescending(i => i.CreateDate)
            .Skip(skip)
            .Limit(limit)
            .ToListAsync(ct);
    }
    
    public Task<List<CollectionRepo>> GetByTagAsync(Guid tagId, int skip, int limit, CancellationToken ct = default)
    {
        var filter = Builders<CollectionRepo>.Filter
            .AnyEq(x => x.Tags, tagId);

        return _collection.Find(filter)
            .SortByDescending(i => i.CreateDate)
            .Skip(skip)
            .Limit(limit)
            .ToListAsync(ct);
    }
    
    public Task<List<CollectionRepo>> GetByRequiredTagsAsync(Guid[] tagIds, int skip, int limit, CancellationToken ct = default)
    {
        var filter = Builders<CollectionRepo>.Filter
            .All(x => x.Tags, tagIds);

        return _collection.Find(filter)
            .SortByDescending(i => i.CreateDate)
            .Skip(skip)
            .Limit(limit)
            .ToListAsync(ct);
    }
    
    public Task<List<CollectionRepo>> GetByAnyTagsAsync(Guid[] tagIds, int skip, int limit, CancellationToken ct = default)
    {
        var filter = Builders<CollectionRepo>.Filter
            .AnyIn(x => x.Tags, tagIds);

        return _collection.Find(filter)
            .SortByDescending(i => i.CreateDate)
            .Skip(skip)
            .Limit(limit)
            .ToListAsync(ct);
    }
}