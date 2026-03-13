using Filmograf.BaseLibrary.Models.Repo;
using MongoDB.Driver;

namespace Filmograf.BaseLibrary.DataAccess.Repositories;

public class MovieRateRepository : RepositoryBase<MovieRateRepo>
{
    public static readonly string CollectionName = "movies_rates";
    
    public MovieRateRepository(IMongoDatabase database) : base(database, CollectionName)
    {
    }
    
    public Task<MovieRateRepo?> GetByUserAndMovieAsync(Guid userId, string movieId, CancellationToken ct = default)
    {
        return _collection.Find(x =>
                x.UserId == userId &&
                x.MovieId == movieId)
            .FirstOrDefaultAsync(ct);
    }
    
    public Task<List<MovieRateRepo>> GetUserRatesAsync(Guid userId, CancellationToken ct = default)
    {
        return _collection.Find(x =>
                x.UserId == userId)
            .ToListAsync(ct);
    }
    
    public Task<List<MovieRateRepo>> GetMovieRatesAsync(string movieId, CancellationToken ct = default)
    {
        return _collection.Find(x =>
                x.MovieId == movieId)
            .ToListAsync(ct);
    }
}