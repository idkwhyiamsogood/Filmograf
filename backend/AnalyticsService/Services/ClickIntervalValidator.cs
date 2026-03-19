using Filmograf.AnalyticsService.Caching;
using Filmograf.AnalyticsService.Models.Types;

namespace Filmograf.AnalyticsService.Services;

public class ClickIntervalValidator
{
    private readonly ClickEntityCaching _clickEntityCaching;
    
    public ClickIntervalValidator(ClickEntityCaching clickEntityCaching)
    {
        _clickEntityCaching = clickEntityCaching;
    }

    public async Task<bool> ValidateClickAsync(Guid userId, string entityType, string entityId)
    {
        var exitingCache = await _clickEntityCaching.GetUserClickAsync(userId, entityType, entityId);
        if (exitingCache != null) return false;

        var newCache = new ClickEntityEvent();
        await _clickEntityCaching.SetUserClickAsync(userId, entityType, entityId, newCache);
        return true;
    }
}