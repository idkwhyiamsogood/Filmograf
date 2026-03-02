using Filmograf.BaseLibrary.Caching;
using Filmograf.BaseLibrary.DataAccess.Providers;
using Filmograf.BaseLibrary.Models.HttpExceptions;
using Filmograf.BaseLibrary.Models.Types;

namespace Filmograf.BaseLibrary.Services;

public class UserService
{
    private readonly UserProvider _userProvider;
    private readonly UserCaching _userCaching;
    
    public UserService(UserProvider userProvider, UserCaching userCaching)
    {
        _userProvider = userProvider;
        _userCaching = userCaching;
    }

    public async Task<User?> GetByGoogleIdAsync(string googleId)
    {
        return await _userProvider.GetByGoogleIdAsync(googleId);
    }
    
    private async Task<User> CreateCacheForUserAsync(Guid userId)
    {
        var user = await _userProvider.GetAsync(userId);
        if (user == null) throw new NotFoundHttpException("UserNotFound", $"Пользователь с id={userId} не найден.");

        return user;
    }

    public async Task<User?> GetByIdAsync(Guid guid)
    {
        var method = async () => await CreateCacheForUserAsync(guid);
        return await _userCaching.CachingAsync(guid, method);
    }

    public async Task<User?> CreateUserAsync(User user)
    {
        return await _userProvider.AddAsync(user);
    }
    
    public async Task<bool> UpdateUserAsync(Guid guid, User user)
    {
        var state = await _userProvider.UpdateAsync(guid, user);
        if (state) await _userCaching.RemoveCachingAsync(guid);

        return state;
    }
}