using Filmograf.BaseLibrary.Models.Repo;
using MongoDB.Driver;

namespace Filmograf.BaseLibrary.DataAccess.Repositories;

public class CommentRepository : RepositoryBase<CommentRepo>
{
    public static readonly string CollectionName = "comments";

    public CommentRepository(IMongoDatabase database) : base(database, CollectionName)
    {
    }
    
    // Получить root-комментарии сущности
    public Task<List<CommentRepo>> GetRootsAsync(string entityId, CommentEntityType type, int skip, int limit, 
        CancellationToken ct = default)
    {
        return _collection.Find(x =>
                x.EntityId == entityId &&
                x.EntityType == type &&
                x.Depth == 1 &&
                !x.IsDeleted)
            .SortByDescending(x => x.CreateDate)
            .Skip(skip)
            .Limit(limit)
            .ToListAsync(ct);
    }

    // Получить детей по ParentId
    public Task<List<CommentRepo>> GetChildrenAsync(string parentId, CancellationToken ct = default)
    {
        return _collection.Find(x =>
                x.ParentId == parentId &&
                !x.IsDeleted)
            .SortBy(x => x.CreateDate)
            .ToListAsync(ct);
    }

    // Получить кол-во детей по ParentId
    public Task<long> CountChildrenAsync(string parentId, CancellationToken ct = default)
    {
        return _collection.Find(x =>
                x.ParentId == parentId &&
                !x.IsDeleted)
            .CountAsync(ct);
    }

    // Получить всю ветку по Path
    public Task<List<CommentRepo>> GetBranchAsync(string entityId, string path, CancellationToken ct = default)
    {
        return _collection.Find(x =>
                x.EntityId == entityId &&
                x.Path.StartsWith(path) &&
                !x.IsDeleted)
            .SortBy(x => x.Path)
            .ToListAsync(ct);
    }

    // Soft delete
    public Task SoftDeleteAsync(string commentId, CancellationToken ct = default)
    {
        var update = Builders<CommentRepo>.Update
            .Set(x => x.IsDeleted, true);

        return _collection.UpdateOneAsync(
            x => x.Id == commentId,
            update,
            cancellationToken: ct);
    }
}