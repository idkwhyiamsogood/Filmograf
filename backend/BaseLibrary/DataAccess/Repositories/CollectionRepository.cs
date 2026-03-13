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
    
    
    
}