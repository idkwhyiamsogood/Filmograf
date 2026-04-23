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
    
    public async Task<List<MovieRepo>> GetByGenresAsync(IEnumerable<Guid> genreIds, int limit, CancellationToken ct = default)
    {
        // Используем AnyIn для проверки наличия элементов в массиве GenreIds
        var filter = Builders<MovieRepo>.Filter.AnyIn(x => x.GenreIds, genreIds);
        
        return await _collection.Find(filter)
            .Limit(limit)
            .ToListAsync(ct);
    }

    public async Task<List<MovieRepo>> GetByAllGenresAsync(IEnumerable<Guid> genreIds, CancellationToken ct = default)
    {
        var filter = Builders<MovieRepo>.Filter.All(x => x.GenreIds, genreIds);
        
        return await _collection.Find(filter)
            .ToListAsync(ct);
    }
    
    public async Task<List<MovieRepo>> GetByNameWithFiltersAsync(string name, IEnumerable<Guid>? includeGenreIds, IEnumerable<Guid>? excludeGenreIds,
        bool strictMatch, string[]? fromYearTo = null, float[]? fromGradeTo = null, int[]? ageRating = null, CancellationToken ct = default)
    {
        var filters = new List<FilterDefinition<MovieRepo>>();

        // Добавляем фильтр по имени, только если оно передано
        if (!string.IsNullOrWhiteSpace(name))
        {
            var escapedName = Regex.Escape(name);
            filters.Add(Builders<MovieRepo>.Filter.Regex(x => x.Name, new BsonRegularExpression(escapedName, "i")));
        }

        // Фильтры по жанрам (включаемые)
        if (includeGenreIds?.Any() == true)
        {
            filters.Add(strictMatch
                ? Builders<MovieRepo>.Filter.All(x => x.GenreIds, includeGenreIds)
                : Builders<MovieRepo>.Filter.AnyIn(x => x.GenreIds, includeGenreIds));
        }

        // Исключаемые жанры
        if (excludeGenreIds?.Any() == true)
        {
            filters.Add(Builders<MovieRepo>.Filter.Not(
                Builders<MovieRepo>.Filter.AnyIn(x => x.GenreIds, excludeGenreIds)));
        }

        // Года
        if (fromYearTo?.Length == 2 && !string.IsNullOrEmpty(fromYearTo[0]))
        {
            filters.Add(Builders<MovieRepo>.Filter.Gte(x => x.Year, fromYearTo[0]));
            filters.Add(Builders<MovieRepo>.Filter.Lte(x => x.Year, fromYearTo[1]));
        }
    
        // Рейтинг
        if (fromGradeTo?.Length == 2)
        {
            filters.Add(Builders<MovieRepo>.Filter.Gte(x => x.RateIMDb, fromGradeTo[0]));
            filters.Add(Builders<MovieRepo>.Filter.Lte(x => x.RateIMDb, fromGradeTo[1]));
        }
    
        // Возрастной рейтинг
        if (ageRating?.Any() == true)
        {
            filters.Add(Builders<MovieRepo>.Filter.In(x => x.AgeLimit, ageRating));
        }

        // Если фильтров вообще нет (например, пустой поиск), возвращаем всё или пустой список
        var finalFilter = filters.Any() ? Builders<MovieRepo>.Filter.And(filters) : Builders<MovieRepo>.Filter.Empty;

        return await _collection.Find(finalFilter).ToListAsync(ct);
    }
}