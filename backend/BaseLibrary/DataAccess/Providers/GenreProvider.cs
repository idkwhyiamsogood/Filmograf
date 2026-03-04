using Filmograf.BaseLibrary.DataAccess.DbContext;
using Filmograf.BaseLibrary.Models.Entities;
using Filmograf.BaseLibrary.Models.Types;
using MongoDB.Driver.Linq;

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
}