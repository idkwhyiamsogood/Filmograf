using Filmograf.BaseLibrary.Models.Repo;
using MongoDB.Driver;

namespace Filmograf.BaseLibrary.DataAccess.Repositories;

public class MovieRepository : RepositoryBase<MovieRepo>
{
    public static readonly string CollectionName = "movies";

    public MovieRepository(IMongoDatabase database) : base(database, CollectionName)
    {
    }
    
    public Task<MovieRepo?> GetByNameAndYearAsync(string name, string year, CancellationToken ct = default)
    {
        return _collection.Find(x =>
                x.Name == name &&
                x.Year == year)
            .FirstOrDefaultAsync(ct);
    }
}