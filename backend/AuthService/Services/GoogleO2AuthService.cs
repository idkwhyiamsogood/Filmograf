using System.Security.Claims;
using Filmograf.BaseLibrary.DataAccess.Providers;
using Filmograf.BaseLibrary.Models.Entities;
using Filmograf.BaseLibrary.Models.HttpExceptions;
using Filmograf.BaseLibrary.Services;
using Microsoft.AspNetCore.Authentication;
using Google.Apis.Auth;

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
    private readonly AuthProvider _authProvider;
    
    public GoogleO2AuthService(UserService userService, JwtService jwtService, AuthProvider authProvider, 
        GoogleO2IdempotenceService idempotenceService)
    {
        _userService = userService;
        _jwtService = jwtService;
        _authProvider = authProvider;
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
    /// С течением времени чел может сменить аву или имя пользователя (в гугл аккаунте)
    /// </summary>
    /// <returns></returns>
    private async Task<User> ProcessInvalidClaimsAsync(User user, string? name, string? avatarUrl)
    {
        bool hasBeenUpdated = false;
        
        if (name != null && user.Name != name)
        {
            user.Name = name;
            hasBeenUpdated = true;
        }
        
        if (avatarUrl != null && user.AvatarUrl != avatarUrl)
        {
            user.AvatarUrl = avatarUrl;
            hasBeenUpdated = true;
        }

        if (hasBeenUpdated)
        {
            await _userService.UpdateUserAsync(user.Id, user);
        }
        
        return user;
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

        // актуализируем клеймы name и avatarUrl
        await ProcessInvalidClaimsAsync(user, name, avatarUrl);
        
        // генерим временный idempotence код
        var idempotence = await _idempotenceService.CreateCodeAsync(user.Id, userAgent, ip);
        return idempotence.Code;
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
        var jwt = _jwtService.GenerateToken(user);
        await HandleAddAuthAsync(jwt, user.Id, userAgent, ip);
        return jwt;
    }
    
    public async Task<string> ProcessNativeGoogleUserAsync(GoogleJsonWebSignature.Payload payload, string? userAgent, string? ip)
    {
        // 1. Извлекаем данные из payload (это то, что прислала мобилка и мы провалидировали в контроллере)
        var email = payload.Email;
        var googleId = payload.Subject; // Subject в Google JWT — это уникальный ID пользователя
        var name = payload.Name;
        var avatarUrl = payload.Picture;

        if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(googleId))
            throw new UnauthorizedHttpException("Incomplete profile data from Google");

        // 2. Ищем или создаем пользователя (используем твою логику)
        var user = await _userService.GetByGoogleIdAsync(googleId);
        user ??= await CreateUserAsync(email, googleId, name, avatarUrl);

        // 3. Актуализируем данные (аватарку, имя)
        await ProcessInvalidClaimsAsync(user, name, avatarUrl);

        // 4. Генерируем сразу полноценный JWT
        var jwt = _jwtService.GenerateToken(user);
    
        // 5. Сохраняем сессию в базу (HandleAddAuthAsync)
        await HandleAddAuthAsync(jwt, user.Id, userAgent, ip);

        return jwt;
    }
}