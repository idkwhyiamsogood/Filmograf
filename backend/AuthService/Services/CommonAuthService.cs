using Filmograf.BaseLibrary.DataAccess.Providers;
using Filmograf.BaseLibrary.Models.Entities;
using Filmograf.BaseLibrary.Models.HttpExceptions;
using Filmograf.MoviesService.Models.Dto;

namespace Filmograf.MoviesService.Services;

public class CommonAuthService
{
    private readonly UserProvider _userProvider;
    private readonly AuthProvider _authProvider;
    private readonly JwtService _jwtService;
    
    public CommonAuthService(UserProvider userProvider, AuthProvider authProvider, JwtService jwtService)
    {
        _userProvider = userProvider;
        _authProvider = authProvider;
        _jwtService = jwtService;
    }

    /// <summary>
    /// p.s. все http-ошибки лишины смысла для исключения конкретики при скомпроментированной атаке 
    /// </summary>
    /// <returns></returns>
    public async Task<AuthResponseDto> RefreshJwtAsync(string jwt)
    {
        var lastJwt = await _authProvider.GetByJwtAsync(jwt);
        if (lastJwt == null) throw new ForbiddenHttpException("Bad auth-refresh");

        var targetUser = await _userProvider.GetAsync(lastJwt.UserId);
        if (targetUser == null) throw new ForbiddenHttpException("Bad auth-refresh");

        await _authProvider.DeleteByJwtAsync(jwt);
        
        var newJwt = _jwtService.GenerateToken(targetUser);
        
        return new AuthResponseDto 
        { Jwt = newJwt };
    }
}