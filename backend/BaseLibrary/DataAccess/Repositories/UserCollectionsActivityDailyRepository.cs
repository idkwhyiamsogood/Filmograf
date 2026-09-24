using Filmograf.BaseLibrary.Models.Repo;
using MongoDB.Driver;

namespace Filmograf.BaseLibrary.DataAccess.Repositories;

public class UserCollectionsActivityDailyRepository : RepositoryBase<UserCollectionsActivityDailyRepo>
{
    public static readonly string CollectionName = "user_collection_clicks";
    
    public UserCollectionsActivityDailyRepository(IMongoDatabase database) : base(database, CollectionName)
    {
    }
    
    // Добавляем клик пользователя в массив за день
    public async Task AddClickAsync(Guid userId, UserCollectionClickEvent item, CancellationToken ct = default)
    {
        var date = DateOnly.FromDateTime(item.Timestamp);
        
        var filter = Builders<UserCollectionsActivityDailyRepo>.Filter.And(
            Builders<UserCollectionsActivityDailyRepo>.Filter
                .Eq(x => x.UserId, userId),
            
            Builders<UserCollectionsActivityDailyRepo>.Filter
                .Eq(x => x.Date, date)
        );

        // $push добавляет элемент в массив
        var update = Builders<UserCollectionsActivityDailyRepo>.Update
            .Push(x => x.Clicks, item)
            .SetOnInsert(x => x.UserId, userId)
            .SetOnInsert(x => x.Date, date);

        await _collection.UpdateOneAsync(filter, update, new UpdateOptions { IsUpsert = true }, ct);
    }
    
    // Получить историю конкретного пользователя в определенный день
    public async Task<UserCollectionsActivityDailyRepo?> GetByUserAndDateAsync(Guid userId, DateOnly date, CancellationToken ct = default)
    {
        var filter = Builders<UserCollectionsActivityDailyRepo>.Filter.And(
            Builders<UserCollectionsActivityDailyRepo>.Filter
                .Eq(x => x.UserId, userId),
            
            Builders<UserCollectionsActivityDailyRepo>.Filter
                .Eq(x => x.Date, date)
        );

        return await _collection.Find(filter)
            .SortByDescending(x => x.Date)
            .FirstOrDefaultAsync(ct);
    }

    // Получить историю конкретного пользователя за период
    public async Task<List<UserCollectionsActivityDailyRepo>> GetUserHistoryAsync(Guid userId, DateOnly from, DateOnly to, 
        CancellationToken ct = default)
    {
        var filter = Builders<UserCollectionsActivityDailyRepo>.Filter.And(
            Builders<UserCollectionsActivityDailyRepo>.Filter
                .Eq(x => x.UserId, userId),
            
            Builders<UserCollectionsActivityDailyRepo>.Filter
                .Gte(x => x.Date, from),
            
            Builders<UserCollectionsActivityDailyRepo>.Filter
                .Lte(x => x.Date, to)
        );

        return await _collection.Find(filter)
            .SortByDescending(x => x.Date)
            .ToListAsync(ct);
    }

    // Получить историю конкретного пользователя с пагинацией
    public async Task<List<UserCollectionsActivityDailyRepo>> GetUserHistoryAsync(Guid userId, int skip, int limit, 
        CancellationToken ct = default)
    {
        var filter = Builders<UserCollectionsActivityDailyRepo>.Filter.And(
            Builders<UserCollectionsActivityDailyRepo>.Filter
                .Eq(x => x.UserId, userId)
        );

        return await _collection.Find(filter)
            .SortByDescending(x => x.Date)
            .Skip(skip)
            .Limit(limit)
            .ToListAsync(ct);
    }
}