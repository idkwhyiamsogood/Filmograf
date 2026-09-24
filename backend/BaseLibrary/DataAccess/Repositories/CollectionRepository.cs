using System.Text.RegularExpressions;
using Filmograf.BaseLibrary.Models.Repo;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Filmograf.BaseLibrary.DataAccess.Repositories;

public class CollectionRepository : RepositoryBase<CollectionRepo>
{
    public static readonly string CollectionName = "collections";
    
    public CollectionRepository(IMongoDatabase database) : base(database, CollectionName)
    {
    }
    
    // вспомогательный метод для построения фильтра с учетом IsDeleted
    private FilterDefinition<CollectionRepo> BuildBaseFilter(bool showDeleted)
    {
        var builder = Builders<CollectionRepo>.Filter;
        if (showDeleted) return builder.Empty; // показываем все
        
        return builder.Eq(x => x.IsDeleted, false); // показываем только неудаленные
    }
    
    public Task<List<CollectionRepo>> GetByNameAsync(string name, bool showDeleted = false, CancellationToken ct = default)
    {
        // Если имя пустое, возвращаем все (с учетом showDeleted)
        if (string.IsNullOrWhiteSpace(name))
        {
            return _collection.Find(BuildBaseFilter(showDeleted)).ToListAsync(ct);
        }

        var escapedName = Regex.Escape(name);
        var baseFilter = BuildBaseFilter(showDeleted);
        var nameFilter = Builders<CollectionRepo>.Filter.Regex(x => x.Name, new BsonRegularExpression(escapedName, "i"));
        var combinedFilter = Builders<CollectionRepo>.Filter.And(baseFilter, nameFilter);
    
        return _collection.Find(combinedFilter).ToListAsync(ct);
    }
    
    public Task<List<CollectionRepo>> GetByUserAsync(Guid userId, int skip, int limit, bool showDeleted = false, CancellationToken ct = default)
    {
        var baseFilter = BuildBaseFilter(showDeleted);
        var userFilter = Builders<CollectionRepo>.Filter.Eq(x => x.UserId, userId);
        var combinedFilter = Builders<CollectionRepo>.Filter.And(baseFilter, userFilter);
    
        return _collection.Find(combinedFilter)
            .SortByDescending(i => i.CreateDate)
            .Skip(skip)
            .Limit(limit)
            .ToListAsync(ct);
    }
    
    public Task<List<CollectionRepo>> GetByTagAsync(Guid tagId, int skip, int limit, bool showDeleted = false, CancellationToken ct = default)
    {
        var baseFilter = BuildBaseFilter(showDeleted);
        var tagFilter = Builders<CollectionRepo>.Filter.AnyEq(x => x.Tags, tagId);
        var combinedFilter = Builders<CollectionRepo>.Filter.And(baseFilter, tagFilter);

        return _collection.Find(combinedFilter)
            .SortByDescending(i => i.CreateDate)
            .Skip(skip)
            .Limit(limit)
            .ToListAsync(ct);
    }
    
    public Task<List<CollectionRepo>> GetByRequiredTagsAsync(Guid[] tagIds, int skip, int limit, bool showDeleted = false, CancellationToken ct = default)
    {
        var baseFilter = BuildBaseFilter(showDeleted);
        var tagsFilter = Builders<CollectionRepo>.Filter.All(x => x.Tags, tagIds);
        var combinedFilter = Builders<CollectionRepo>.Filter.And(baseFilter, tagsFilter);

        return _collection.Find(combinedFilter)
            .SortByDescending(i => i.CreateDate)
            .Skip(skip)
            .Limit(limit)
            .ToListAsync(ct);
    }
    
    public Task<List<CollectionRepo>> GetByAnyTagsAsync(Guid[] tagIds, int skip, int limit, bool showDeleted = false, CancellationToken ct = default)
    {
        var baseFilter = BuildBaseFilter(showDeleted);
        var tagsFilter = Builders<CollectionRepo>.Filter.AnyIn(x => x.Tags, tagIds);
        var combinedFilter = Builders<CollectionRepo>.Filter.And(baseFilter, tagsFilter);

        return _collection.Find(combinedFilter)
            .SortByDescending(i => i.CreateDate)
            .Skip(skip)
            .Limit(limit)
            .ToListAsync(ct);
    }
    
    public async Task<bool> SoftDeleteAsync(string id, CancellationToken ct = default)
    {
        var filter = Builders<CollectionRepo>.Filter.Eq(x => x.Id, id);
        var update = Builders<CollectionRepo>.Update.Set(x => x.IsDeleted, true);
        
        var result = await _collection.UpdateOneAsync(filter, update, cancellationToken: ct);
        return result.ModifiedCount > 0;
    }
    
    public async Task<bool> RestoreAsync(string id, CancellationToken ct = default)
    {
        var filter = Builders<CollectionRepo>.Filter.Eq(x => x.Id, id);
        var update = Builders<CollectionRepo>.Update.Set(x => x.IsDeleted, false);
        
        var result = await _collection.UpdateOneAsync(filter, update, cancellationToken: ct);
        return result.ModifiedCount > 0;
    }
    
    public async Task<List<CollectionRepo>> GetByNameWithFiltersAsync(string name, IEnumerable<Guid>? includeGenreIds, IEnumerable<Guid>? excludeGenreIds, 
        IEnumerable<Guid>? includeTagsIds, IEnumerable<Guid>? excludeTagsIds, bool strictMatch, CancellationToken ct = default)
    {
        var filters = new List<FilterDefinition<CollectionRepo>>();

        // 1. Учитываем мягкое удаление (базовая логика)
        filters.Add(Builders<CollectionRepo>.Filter.Eq(x => x.IsDeleted, false));

        // 2. Поиск по имени только если оно не пустое
        if (!string.IsNullOrWhiteSpace(name))
        {
            var escapedName = Regex.Escape(name);
            filters.Add(Builders<CollectionRepo>.Filter.Regex(x => x.Name, new BsonRegularExpression(escapedName, "i")));
        }

        // 3. Жанры
        if (includeGenreIds?.Any() == true)
        {
            filters.Add(strictMatch
                ? Builders<CollectionRepo>.Filter.All(x => x.GenreIds, includeGenreIds)
                : Builders<CollectionRepo>.Filter.AnyIn(x => x.GenreIds, includeGenreIds));
        }

        if (excludeGenreIds?.Any() == true)
        {
            filters.Add(Builders<CollectionRepo>.Filter.Not(
                Builders<CollectionRepo>.Filter.AnyIn(x => x.GenreIds, excludeGenreIds)));
        }

        // 4. Теги
        if (includeTagsIds?.Any() == true)
        {
            filters.Add(strictMatch
                ? Builders<CollectionRepo>.Filter.All(x => x.Tags, includeTagsIds)
                : Builders<CollectionRepo>.Filter.AnyIn(x => x.Tags, includeTagsIds));
        }

        if (excludeTagsIds?.Any() == true)
        {
            filters.Add(Builders<CollectionRepo>.Filter.Not(
                Builders<CollectionRepo>.Filter.AnyIn(x => x.Tags, excludeTagsIds)));
        }

        // Собираем всё через AND. Так как мы всегда добавляем фильтр IsDeleted, массив фильтров никогда не будет пустым.
        var finalFilter = Builders<CollectionRepo>.Filter.And(filters);

        return await _collection.Find(finalFilter).ToListAsync(ct);
    }
}