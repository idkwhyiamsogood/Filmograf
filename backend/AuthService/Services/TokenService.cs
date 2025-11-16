using Filmograf.AuthService.Models.Types;

namespace Filmograf.AuthService.Services;

public class TokenService
{
    private readonly RedisService _redisService;
    private readonly TimeSpan _tokenLifetime = TimeSpan.FromDays(30);
    
    public TokenService(RedisService redisService)
    {
        _redisService = redisService;
    }
    
    public async Task<string> CreateTokenAsync()
    {
        var token = Guid.NewGuid().ToString("N");
        
        var authToken = new Auth
        {
            Token = token,
            CreatedAt = DateTime.UtcNow
        };

        // сохраняем в Redis
        await _redisService.SetAsync($"auth:{token}", authToken, _tokenLifetime);
        
        return token;
    }

    public async Task<Auth?> ValidateTokenAsync(string token)
    {
        if (string.IsNullOrEmpty(token)) return null;

        var authToken = await _redisService.GetAsync<Auth>($"auth:{token}");
        if (authToken == null || !authToken.IsActive) return null;

        // обновить TTL при успешной валидации
        await _redisService.UpdateExpiryAsync($"auth:{token}", _tokenLifetime);
        
        return authToken;
    }

    public async Task RevokeTokenAsync(string token)
    {
        await _redisService.RemoveAsync($"auth:{token}");
    }
}