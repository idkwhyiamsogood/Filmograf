using Filmograf.BaseLibrary.Models.Repo;
using MongoDB.Driver;

namespace Filmograf.BaseLibrary.DataAccess.Repositories;

public class CommentLikeRepository : RepositoryBase<CommentLikeRepo>
{
    public static readonly string CollectionName = "comment_likes";
    
    public CommentLikeRepository(IMongoDatabase database) : base(database, CollectionName)
    {
    }
    
    // Посчитать реакции
    public async Task<List<CommentLikeRepo>> GetByCommentAsync(string commentId, CancellationToken ct = default)
    {
        var filter = Builders<CommentLikeRepo>.Filter
            .Eq(x => x.CommentId, commentId);
    
        return await _collection.Find(filter)
            .ToListAsync(ct);
    }
    
    // Поставить или изменить лайк
    public Task UpsertAsync(string commentId, Guid userId, int value, CancellationToken ct = default)
    {
        var filter = Builders<CommentLikeRepo>.Filter
            .Where(x => x.CommentId == commentId && x.UserId == userId);

        var update = Builders<CommentLikeRepo>.Update
            .Set(x => x.Value, value)
            .Set(x => x.UpdateDate, DateTime.UtcNow);

        return _collection.UpdateOneAsync(
            filter,
            update,
            new UpdateOptions { IsUpsert = true },
            ct);
    }

    // Удалить лайк
    public Task RemoveAsync(string commentId, Guid userId, CancellationToken ct = default)
    {
        return _collection.DeleteOneAsync(
            x => x.CommentId == commentId && x.UserId == userId,
            ct);
    }

    // Проверить реакцию пользователя
    public Task<CommentLikeRepo?> GetUserReactionAsync(string commentId, Guid userId, CancellationToken ct = default)
    {
        return _collection.Find(x =>
                x.CommentId == commentId &&
                x.UserId == userId)
            .FirstOrDefaultAsync(ct);
    }

    // Посчитать лайки
    public Task<long> CountByValueAsync(string commentId, int value, CancellationToken ct = default)
    {
        return _collection.CountDocumentsAsync(
            x => x.CommentId == commentId && x.Value == value,
            cancellationToken: ct);
    }
}