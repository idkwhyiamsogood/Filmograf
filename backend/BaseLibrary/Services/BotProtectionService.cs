using Filmograf.BaseLibrary.Models.HttpExceptions;

namespace Filmograf.BaseLibrary.Services;

public class BotProtectionService
{
    private bool IsKnownBot(string userAgent)
    {
        var blocked = new[]
        { "curl", "Postman", "Insomnia", "python", "wget" };

        return blocked.Any(x =>
            userAgent.Contains(x, StringComparison.OrdinalIgnoreCase));
    }
    
    public async Task ValidateClient(string? userAgent, string? ip)
    {
        if (string.IsNullOrWhiteSpace(userAgent) || string.IsNullOrWhiteSpace(ip)) throw new BadRequestHttpException(
            "NoAvailableHeadersData", "There is no info about 'userAgent' and 'ip'.");
        
        if (userAgent.Length < 10 || userAgent.Length > 500) throw new BadRequestHttpException(
            "NoAvailableHeadersData", "There is no valid userAgent");

        if (IsKnownBot(userAgent)) throw new ForbiddenHttpException("NoAccess", "There is no access for this client");
    }
}