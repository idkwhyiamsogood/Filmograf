using System.Text.RegularExpressions;
using Filmograf.BaseLibrary.Models.Repo;
using MongoDB.Bson;
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
    
    public async Task<List<MovieRepo>> GetByNamesAndYearsAsync(List<string> names, List<string> years)
    {
        var filter = Builders<MovieRepo>.Filter.And(
            Builders<MovieRepo>.Filter.In(x => x.Name, names),
            Builders<MovieRepo>.Filter.In(x => x.Year, years)
        );
        return await _collection.Find(filter).ToListAsync();
    }

    public async Task CreateManyAsync(IEnumerable<MovieRepo> items)
    {
        await _collection.InsertManyAsync(items);
    }

    public Task<List<MovieRepo>> GetByNameAsync(string name, CancellationToken ct = default)
    {
        var escapedName = Regex.Escape(name);
        
        var filter = Builders<MovieRepo>.Filter.Regex(x => x.Name, 
            new BsonRegularExpression(escapedName, "i"));
    
        return _collection.Find(filter)
            .ToListAsync(ct);
    }
    
}