using Filmograf.BaseLibrary.DataAccess.Providers;
using Filmograf.BaseLibrary.Models.Types;

namespace Filmograf.MoviesService.Services;

public class UserService
{
    private readonly UserProvider _userProvider;
    
    public UserService(UserProvider userProvider)
    {
        _userProvider = userProvider;
    }

    public async Task<User?> GetByGoogleIdAsync(string googleId)
    {
        return await _userProvider.GetByGoogleIdAsync(googleId);
    }

    public async Task<User?> GetByIdAsync(Guid guid)
    {
        return await _userProvider.GetAsync(guid);
    }

    public async Task<User?> CreateUserAsync(User user)
    {
        return await _userProvider.AddAsync(user);
    }
}