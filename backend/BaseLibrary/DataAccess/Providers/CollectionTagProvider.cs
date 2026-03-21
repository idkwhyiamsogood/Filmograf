using Filmograf.BaseLibrary.DataAccess.DbContext;
using Filmograf.BaseLibrary.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace Filmograf.BaseLibrary.DataAccess.Providers;

public class CollectionTagProvider : ProviderBase<CollectionTag>
{
    public CollectionTagProvider(DbContextBase contextBase) : base(contextBase)
    {
    }
    
    public virtual async Task<IEnumerable<CollectionTag>> ListAllAsync(int skip, int limit)
    {
        return await GetDbSet()
            .OrderByDescending(x => x.Name)
            .Skip(skip)
            .Take(limit)
            .ToListAsync();
    }

    public async Task<CollectionTag?> GetByNameAsync(string name)
    {
        return await _contextBase.CollectionTags
            .FirstOrDefaultAsync(i => i.Name == name);
    }

    public async Task<CollectionTag?> SearchByNameAsync(string name)
    {
        return await _contextBase.CollectionTags
            .FirstOrDefaultAsync(i => 
                EF.Functions.Like(i.Name, $"%{name}%"));
    }
    
    public async Task<List<CollectionTag>> SearchAllByNameAsync(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            return new List<CollectionTag>();
            
        return await _contextBase.CollectionTags
            .Where(i => EF.Functions.Like(i.Name, $"%{name}%"))
            .OrderBy(i => i.Name)
            .ToListAsync();
    }
    
}