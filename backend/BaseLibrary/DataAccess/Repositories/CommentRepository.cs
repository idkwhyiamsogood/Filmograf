using Filmograf.BaseLibrary.Models.Repo;
using MongoDB.Driver;

namespace Filmograf.BaseLibrary.DataAccess.Repositories;

public class CommentRepository : RepositoryBase<CommentRepo>
{
    public static readonly string CollectionName = "comments";

    public CommentRepository(IMongoDatabase database) : base(database, CollectionName)
    {
    }
}