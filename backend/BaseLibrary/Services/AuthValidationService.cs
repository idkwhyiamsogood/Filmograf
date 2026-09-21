using Filmograf.BaseLibrary.Caching;
using Filmograf.BaseLibrary.DataAccess.Providers;
using Filmograf.BaseLibrary.Models.Context;
using Filmograf.BaseLibrary.Models.HttpExceptions;
using Filmograf.BaseLibrary.Models.Types;

namespace Filmograf.BaseLibrary.Services;

public class AuthValidationService
{
    private readonly AuthProvider _authProvider;
    private readonly UserService _userService;

    public AuthValidationService(AuthProvider authProvider, UserService userService)
    {
        _authProvider = authProvider;
        _userService = userService;
    }

    public async Task<AuthContext> CheckAuthAsync(Guid targetUserId, string jwt)
    {
        // получаем данные сессии
        var auth = await _authProvider.GetByJwtAsync(jwt);

        // проверяем все ли гуд
        if (auth == null || auth.UserId != targetUserId || !auth.State)
            throw new ForbiddenHttpException("SessionNotAvailable", "Сессия не найдена или неактивна.");
        
        // если чела нет - выкинет NotFound
        var user = await _userService.GetByIdAsync(auth.UserId);

        // проверяем, не был ли забанен пользователь
        if (!user.IsAdmin && user.IsBanned) 
            throw new ForbiddenHttpException("UserHasBeedBanned", "Пользователь был заблокирован.");

        // возвращаем payload
        return new AuthContext
        {
            CurrentUser = user,
            CurrentAuth = auth
        };
    }
}