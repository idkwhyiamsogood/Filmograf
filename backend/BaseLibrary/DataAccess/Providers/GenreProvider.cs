using Filmograf.BaseLibrary.DataAccess.DbContext;
using Filmograf.BaseLibrary.Models.Entities;
using Filmograf.BaseLibrary.Models.Types;

namespace Filmograf.BaseLibrary.DataAccess.Providers;

public class GenreProvider : ProviderBase<Genre>
{
    public GenreProvider(DbContextBase contextBase) : base(contextBase)
    {
    }
}