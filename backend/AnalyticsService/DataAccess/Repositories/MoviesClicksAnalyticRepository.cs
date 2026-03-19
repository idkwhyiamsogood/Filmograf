using Filmograf.AnalyticsService.Models.Repo;
using Filmograf.BaseLibrary.DataAccess.Repositories;
using MongoDB.Driver;

namespace Filmograf.AnalyticsService.DataAccess.Repositories;

public class MoviesClicksAnalyticRepository : RepositoryBase<MoviesClicksAnalyticRepo>
{
    public static readonly string CollectionName = "movie_clicks";
    
    public MoviesClicksAnalyticRepository(IMongoDatabase database) : base(database, CollectionName)
    {
    }

    public async Task<IEnumerable<MoviesClicksAnalyticRepo>> ListByMovieAsync(string movieId, CancellationToken ct = default)
    {
        var filter = Builders<MoviesClicksAnalyticRepo>.Filter
            .Eq(x => x.MovieId, movieId);
    
        return await _collection.Find(filter)
            .ToListAsync(ct);
    }
    
    public async Task<MoviesClicksAnalyticRepo?> GetByMovieAndDateAsync(string movieId, DateOnly date, CancellationToken ct = default)
    {
        var filter = Builders<MoviesClicksAnalyticRepo>.Filter.And(
            Builders<MoviesClicksAnalyticRepo>.Filter.Eq(x => x.MovieId, movieId),
            Builders<MoviesClicksAnalyticRepo>.Filter.Eq(x => x.TargetDate, date)
        );

        return await _collection.Find(filter).FirstOrDefaultAsync(ct);
    }
    
    public async Task<List<MoviesClicksAnalyticRepo>> GetByMovieAndPeriodAsync(string movieId, DateOnly from, DateOnly to, 
        CancellationToken ct = default)
    {
        var filter = Builders<MoviesClicksAnalyticRepo>.Filter.And(
            Builders<MoviesClicksAnalyticRepo>.Filter
                .Eq(x => x.MovieId, movieId),
            
            Builders<MoviesClicksAnalyticRepo>.Filter
                .Gte(x => x.TargetDate, from),
            
            Builders<MoviesClicksAnalyticRepo>.Filter
                .Lte(x => x.TargetDate, to)
        );

        return await _collection.Find(filter)
            .SortBy(x => x.TargetDate)
            .ToListAsync(ct);
    }
    
    public async Task<List<MoviesClicksAnalyticRepo>> GetByPeriodAsync(DateOnly from, DateOnly to, CancellationToken ct = default)
    {
        var filter = Builders<MoviesClicksAnalyticRepo>.Filter.And(
            Builders<MoviesClicksAnalyticRepo>.Filter
                .Gte(x => x.TargetDate, from),
            
            Builders<MoviesClicksAnalyticRepo>.Filter
                .Lte(x => x.TargetDate, to)
        );

        return await _collection.Find(filter)
            .SortBy(x => x.TargetDate)
            .ToListAsync(ct);
    }
    
    public async Task IncrementClickAsync(string movieId, DateOnly date, CancellationToken ct = default)
    {
        var filter = Builders<MoviesClicksAnalyticRepo>.Filter.And(
            Builders<MoviesClicksAnalyticRepo>.Filter.Eq(x => x.MovieId, movieId),
            Builders<MoviesClicksAnalyticRepo>.Filter.Eq(x => x.TargetDate, date)
        );

        var update = Builders<MoviesClicksAnalyticRepo>.Update
            .Inc(x => x.Count, 1)
            .SetOnInsert(x => x.MovieId, movieId)
            .SetOnInsert(x => x.TargetDate, date);
    
        await _collection.UpdateOneAsync(filter, update, new UpdateOptions { IsUpsert = true }, ct);
    }
}