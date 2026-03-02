using System.Security.Claims;
using Filmograf.BaseLibrary.Models.HttpExceptions;
using Filmograf.BaseLibrary.Models.Types;
using Filmograf.BaseLibrary.Services;
using Microsoft.AspNetCore.Authentication;

namespace Filmograf.MoviesService.Services;

/// <summary>
/// Авторизация через Google o2 происходит полностью изолированно от клиента, на стороне бекенда
/// далее доступ к контенту на сервере будет осуществляться через jwt токен
/// </summary>
public class GoogleO2AuthService
{
    private readonly UserService _userService;
    private readonly JwtService _jwtService;
    private readonly GoogleO2IdempotenceService _idempotenceService;
    
    public GoogleO2AuthService(UserService userService, JwtService jwtService, GoogleO2IdempotenceService idempotenceService)
    {
        
        _userService = userService;
        _jwtService = jwtService;
        _idempotenceService = idempotenceService;
    }
    
    private async Task<User> CreateUserAsync(string email, string googleId, string? name, string? avatarUrl)
    {
        var newUserEntity = new User
        {
            Email = email,
            GoogleId = googleId,
            Name = name,
            AvatarUrl = avatarUrl,
            UserType = "Member"
        };
        
        var newUser = await _userService.CreateUserAsync(newUserEntity);
        if (newUser == null) throw new InternalServerErrorHttpException("CreateUserError", 
            "There is some error on create new user.");

        return newUser;
    }

    /// <summary>
    /// Второй этап авторизации через Google o2 (первый - на стороне гугла, нас это не касается)
    /// Обрабатывает результат авторизации через гугл аккаунт
    /// </summary>
    /// <param name="result">Результат авторизации</param>
    /// <returns>GoogleO2Idempotence code</returns>
    /// <exception cref="UnauthorizedHttpException"></exception>
    public async Task<string> ProcessingGoogleResponseAsync(AuthenticateResult result, string? userAgent, string? ip)
    {
        // ливаем если ошибка какая-то
        if (!result.Succeeded) throw new UnauthorizedHttpException("Google authentication failed");
        
        // достаем клеймы
        var claims = result.Principal?.Claims;
        var email = claims?.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
        var googleId = claims?.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        var name = claims?.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
        var avatarUrl = claims?.FirstOrDefault(c => c.Type == "picture")?.Value;

        // ливаем если нету критически важных клеймов
        if (email == null || googleId == null) throw new UnauthorizedHttpException("Incomplete profile data");

        // достаем чела по googleId
        var user = await _userService.GetByGoogleIdAsync(googleId);
        
        // если чела с таким googleId - чел авторизуется впервые, значит создаем
        user ??= await CreateUserAsync(email, googleId, name, avatarUrl);
        
        // генерим временный idempotence код
        var idempotence = await _idempotenceService.CreateCodeAsync(user.Id, userAgent, ip);
        return idempotence.Code;
    }

    /// <summary>
    /// Третий этап авторизации через Google o2
    /// Верифицируем "временный" код, получая jwt для пользователя (сущность которого
    /// фигурирует во втором этапе)
    ///
    /// p.s. сообщения и инфокоды в http-ошибках намеренно лишены смысла - зашита от ясности ошибок авторизации
    /// </summary>
    /// <param name="idempotenceCode">GoogleO2Idempotence code</param>
    /// <returns>Jwt code</returns>
    public async Task<string> VerifyIdempotenceCodeAsync(string idempotenceCode, string? userAgent, string? ip)
    {
        // если null - значит или его нет впринципе, или уже юзили
        // елси не null - то сразу удалиться, второй раз достать не получиться!
        var idempotence = await _idempotenceService.PullByCodeAsync(idempotenceCode);
        if (idempotence == null) throw new ForbiddenHttpException("BadAuthVerify", "Bad auth verify");
        
        // userAgent на третьем этапе должен быть тот же что и на втором этапе
        if (idempotence.UserAgent != null && idempotence.UserAgent != userAgent) throw new ForbiddenHttpException(
            "BadAuthVerify", "Bad auth verify");
        
        // ip на третьем этапе должен быть тот же что и на втором этапе
        if (idempotence.Ip != null && idempotence.Ip != ip) throw new ForbiddenHttpException(
            "BadAuthVerify", "Bad auth verify");
        
        // получаем пользователя
        var user = await _userService.GetByIdAsync(idempotence.UserId);
        if (user == null) throw new ForbiddenHttpException("BadAuthVerify", "Bad auth verify");
        
        // генерим jwt
        return _jwtService.GenerateToken(user);
    }
}