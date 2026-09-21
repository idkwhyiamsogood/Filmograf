using Filmograf.BaseLibrary.DataAccess.Providers;
using Filmograf.BaseLibrary.Models.Entities;
using Filmograf.BaseLibrary.Models.HttpExceptions;
using Filmograf.BaseLibrary.Models.Types;
using Filmograf.BaseLibrary.Services;
using Filmograf.MoviesService.Caching;
using Filmograf.MoviesService.Models.Types;

namespace Filmograf.MoviesService.Services;

/// <summary>
/// Сервис временной (гостевой) авторизации.
/// Позволяет создавать временных пользователей с выдачей JWT.
/// </summary>
public class TemporaryAuthService
{
    private readonly UserService _userService;
    private readonly JwtService _jwtService;
    private readonly AuthProvider _authProvider;
    private readonly TemporaryGuardCaching _temporaryGuardCaching;
    private readonly BotProtectionService _botProtectionService;
    
    public TemporaryAuthService(UserService userService, JwtService jwtService, AuthProvider authProvider,
        TemporaryGuardCaching temporaryGuardCaching, BotProtectionService botProtectionService)
    {
        _userService = userService;
        _jwtService = jwtService;
        _authProvider = authProvider;
        _temporaryGuardCaching = temporaryGuardCaching;
        _botProtectionService = botProtectionService;
    }

    /// <summary>
    /// Механизм защиты от злоупотреблений
    /// </summary>
    /// <returns>
    /// true - создание разрешено.
    /// false - если превышены лимиты или доступ запрещён.
    /// </returns>
    private async Task<bool> CanCreateTemporaryUserAsync(string userAgent, string ip)
    {
        // if (ip == "127.0.0.1" || ip == "::1") return true;
        return await _temporaryGuardCaching.GetAsync(ip, userAgent) == null;
    }
    
    private async Task HandleAddAuthAsync(string jwt, Guid userId, string? userAgent, string? ip)
    {
        var authEntity = new Auth
        { 
            Jwt = jwt,
            UserId = userId,
            UserAgent = userAgent,
            Ip = ip
        };
        
        await _authProvider.AddAsync(authEntity);
    }
    
    /// <summary>
    /// Создавать временных пользователей
    /// </summary>
    /// <returns>jwt токен</returns>
    public async Task<string> ProcessingTemporaryAuthAsync(string? userAgent, string? ip)
    {
        await _botProtectionService.ValidateClient(userAgent, ip);

        var allowed = await CanCreateTemporaryUserAsync(userAgent!, ip!);
        if (!allowed) throw new ForbiddenHttpException(
            "TempAuthLimit", "Temporary auth limit exceeded.");
        
        var newUserEntity = new User
        { Name = "guest", UserType = "Guest" };

        // создаём временного пользователя
        var newUser = await _userService.CreateUserAsync(newUserEntity);
        if (newUser == null) throw new InternalServerErrorHttpException("CreateUserError", 
            "There is some error on create new user.");

        // ставим guard
        await _temporaryGuardCaching.SetAsync(ip!, userAgent!, new TemporaryAuthGuardItem());

        // генерим jwt
        var jwt = _jwtService.GenerateToken(newUser);
        await HandleAddAuthAsync(jwt, newUser.Id, userAgent, ip);
        return jwt;
    }
}