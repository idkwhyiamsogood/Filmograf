using Filmograf.BaseLibrary.Services;
using Filmograf.MoviesService.Caching;
using Filmograf.MoviesService.Models.Types;

namespace Filmograf.MoviesService.Services;

/// <summary>
/// После прохождения авторизации через Google o2 (это происходит полностью изолированно 
/// </summary>
public class GoogleO2IdempotenceService
{
    private readonly GoogleO2IdempotenceCaching _idempotenceCaching;
    
    public GoogleO2IdempotenceService(GoogleO2IdempotenceCaching idempotenceCaching)
    {
        _idempotenceCaching = idempotenceCaching;
    }

    public async Task<GoogleO2Idempotence> CreateCodeAsync(Guid userId, string? userAgent, string? ip)
    {
        var guid = Guid.NewGuid();
        var code = guid.ToString();

        var idempotence = new GoogleO2Idempotence
        {
            Code = code, 
            UserId = userId,
            UserAgent = userAgent,
            Ip = ip
        };

        await _idempotenceCaching.SetByCodeAsync(code, idempotence);
        return idempotence;
    }

    public async Task<GoogleO2Idempotence?> PullByCodeAsync(string code)
    {
        var idempotence = await _idempotenceCaching.GetByCodeAsync(code);
        if (idempotence == null) return null;

        await _idempotenceCaching.RemoveByCodeAsync(code);
        return idempotence;
    }
}