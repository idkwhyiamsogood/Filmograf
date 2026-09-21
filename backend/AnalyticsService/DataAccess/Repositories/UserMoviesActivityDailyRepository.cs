using Filmograf.AnalyticsService.Models.Repo;
using Filmograf.BaseLibrary.DataAccess.Repositories;
using MongoDB.Driver;

namespace Filmograf.AnalyticsService.DataAccess.Repositories;

public class UserMoviesActivityDailyRepository : RepositoryBase<UserMoviesActivityDailyRepo>
{
    public static readonly string CollectionName = "user_movie_clicks";
    
    public UserMoviesActivityDailyRepository(IMongoDatabase database) : base(database, CollectionName)
    {
    }
    
    // Добавляем клик пользователя в массив за день
    public async Task AddClickAsync(Guid userId, UserMovieClickEvent item, CancellationToken ct = default)
    {
        var date = DateOnly.FromDateTime(item.Timestamp);
        
        var filter = Builders<UserMoviesActivityDailyRepo>.Filter.And(
            Builders<UserMoviesActivityDailyRepo>.Filter
                .Eq(x => x.UserId, userId),
            
            Builders<UserMoviesActivityDailyRepo>.Filter
                .Eq(x => x.Date, date)
        );

        // $push добавляет элемент в массив
        var update = Builders<UserMoviesActivityDailyRepo>.Update
            .Push(x => x.Clicks, item)
            .SetOnInsert(x => x.UserId, userId)
            .SetOnInsert(x => x.Date, date);

        await _collection.UpdateOneAsync(filter, update, new UpdateOptions { IsUpsert = true }, ct);
    }
    
    // Получить историю конкретного пользователя в определенный день
    public async Task<UserMoviesActivityDailyRepo?> GetByUserAndDateAsync(Guid userId, DateOnly date, CancellationToken ct = default)
    {
        var filter = Builders<UserMoviesActivityDailyRepo>.Filter.And(
            Builders<UserMoviesActivityDailyRepo>.Filter
                .Eq(x => x.UserId, userId),
            
            Builders<UserMoviesActivityDailyRepo>.Filter
                .Eq(x => x.Date, date)
        );

        return await _collection.Find(filter)
            .SortBy(x => x.Date)
            .FirstOrDefaultAsync(ct);
    }

    // Получить историю конкретного пользователя за период
    public async Task<List<UserMoviesActivityDailyRepo>> GetUserHistoryAsync(Guid userId, DateOnly from, DateOnly to, CancellationToken ct = default)
    {
        var filter = Builders<UserMoviesActivityDailyRepo>.Filter.And(
            Builders<UserMoviesActivityDailyRepo>.Filter
                .Eq(x => x.UserId, userId),
            
            Builders<UserMoviesActivityDailyRepo>.Filter
                .Gte(x => x.Date, from),
            
            Builders<UserMoviesActivityDailyRepo>.Filter
                .Lte(x => x.Date, to)
        );

        return await _collection.Find(filter)
            .SortBy(x => x.Date)
            .ToListAsync(ct);
    }
}