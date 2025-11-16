using Filmograf.MoviesService.Models.Dto;

namespace Filmograf.MoviesService.Services;

public class AuthService
{
    private readonly TokenService _tokenService;
    
    public AuthService(TokenService tokenService)
    {
        _tokenService = tokenService;
    }
    
    public async Task<LoginResponseDto?> LoginAsync()
    {
        var token = await _tokenService.CreateTokenAsync();

        return new LoginResponseDto
        { Token = token };
    }

    public async Task LogoutAsync(string token)
    {
        await _tokenService.RevokeTokenAsync(token);
    }
}