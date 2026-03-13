using Filmograf.BaseLibrary.Models.Repo;
using MongoDB.Driver;

namespace Filmograf.BaseLibrary.DataAccess.Repositories;

public class CollectionPinRepository : RepositoryBase<CollectionPinRepo>
{
    public static readonly string CollectionName = "collection_pins";
    
    public CollectionPinRepository(IMongoDatabase database) : base(database, CollectionName)
    {
    }
}