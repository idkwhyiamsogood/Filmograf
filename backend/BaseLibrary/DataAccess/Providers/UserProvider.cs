using Filmograf.BaseLibrary.DataAccess.DbContext;
using Filmograf.BaseLibrary.Models.Entities;
using Filmograf.BaseLibrary.Models.Types;
using Microsoft.EntityFrameworkCore;

namespace Filmograf.BaseLibrary.DataAccess.Providers;

public class UserProvider : ProviderBase<User>
{
    public UserProvider(DbContextBase contextBase) : base(contextBase)
    {
    }

    public async Task<User?> GetByGoogleIdAsync(string googleId)
    {
        return await _contextBase.Users
            .Where(i => i.GoogleId == googleId)
            .FirstOrDefaultAsync();
    }
}