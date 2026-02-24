using Filmograf.BaseLibrary.Caching;
using Filmograf.BaseLibrary.DataAccess.Providers;
using Filmograf.BaseLibrary.Models.HttpExceptions;
using Filmograf.BaseLibrary.Models.Types;

namespace Filmograf.BaseLibrary.Services;

public class AuthValidationService
{
    private readonly AuthProvider _authProvider;
    private readonly UserProvider _userProvider;
    private readonly UserCaching _userCaching;

    public AuthValidationService(AuthProvider authProvider, UserProvider userProvider)
    {
        _authProvider = authProvider;
        _userProvider = userProvider;
    }

    private async Task<User> CreateCacheForUserAsync(Guid userId)
    {
        var user = await _userProvider.GetAsync(userId);
        if (user == null) throw new NotFoundHttpException("UserNotFound", $"Пользователь с id={userId} не найден.");

        return user;
    }

    public async Task<User?> GetUserAsync(Guid userId)
    {
        try
        {
            var method = async () => await CreateCacheForUserAsync(userId);
            return await _userCaching.CachingAsync(userId, method);
        }
        catch (NotFoundHttpException nfex)
        {
            return null;
        }
    }

    public async Task<bool> CheckAuthAsync(string jwt, Guid targetUserId)
    {
        // получаем данные сессии
        var auth = await _authProvider.GetByJwtAsync(jwt);

        // проверяем все ли гуд
        if (auth == null || auth.UserId != targetUserId || !auth.State) 
            throw new BadRequestHttpException("")
    }
}