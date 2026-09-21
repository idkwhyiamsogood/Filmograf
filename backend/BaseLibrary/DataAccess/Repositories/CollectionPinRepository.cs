using Filmograf.BaseLibrary.Models.Repo;
using MongoDB.Driver;

namespace Filmograf.BaseLibrary.DataAccess.Repositories;

public class CollectionPinRepository : RepositoryBase<CollectionPinRepo>
{
    public static readonly string CollectionName = "collection_pins";
    
    public CollectionPinRepository(IMongoDatabase database) : base(database, CollectionName)
    {
    }

    public async Task<CollectionPinRepo?> GetByUserAsync(Guid userId, CancellationToken ct = default)
    {
        var filter = Builders<CollectionPinRepo>.Filter
            .Eq(x => x.UserId, userId);
    
        return await _collection.Find(filter)
            .FirstOrDefaultAsync(ct);
    }
}