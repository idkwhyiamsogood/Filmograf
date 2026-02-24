using Filmograf.BaseLibrary.DataAccess.DbContext;
using Filmograf.BaseLibrary.Models.Types;

namespace Filmograf.BaseLibrary.DataAccess.Providers;

public class UserProvider : ProviderBase<User>
{
    public UserProvider(DbContextBase contextBase) : base(contextBase)
    {
    }
}