using Filmograf.BaseLibrary.DataAccess.DbContext;
using Filmograf.BaseLibrary.Models.Entities;
using Filmograf.BaseLibrary.Models.Types;
using Microsoft.EntityFrameworkCore;

namespace Filmograf.BaseLibrary.DataAccess.Providers;

public class GenreProvider : ProviderBase<Genre>
{
    public GenreProvider(DbContextBase contextBase) : base(contextBase)
    {
    }

    public async Task<Genre?> GetByNameAsync(string name)
    {
        return await _contextBase.Genres
            .FirstOrDefaultAsync(i => i.Name == name);
    }
    
    public async Task<List<Genre>> SearchAllByNameAsync(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            return new List<Genre>();
            
        return await _contextBase.Genres
            .Where(i => EF.Functions.Like(i.Name, $"%{name}%"))
            .OrderBy(i => i.Name)
            .ToListAsync();
    }
}