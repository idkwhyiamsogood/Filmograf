using Filmograf.BaseLibrary.Models.Repo;
using MongoDB.Driver;

namespace Filmograf.BaseLibrary.DataAccess.Repositories;

public class CollectionRepository : RepositoryBase<CollectionRepo>
{
    public static readonly string CollectionName = "collections";
    
    public CollectionRepository(IMongoDatabase database) : base(database, CollectionName)
    {
    }
}