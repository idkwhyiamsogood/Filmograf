using Filmograf.BaseLibrary.Services;
using Filmograf.BaseLibrary.Util;

namespace Filmograf.AnalyticsService.Services.HistoryBuilding;

public class DeferredQueueHistoryBuildingService
{
    private readonly HistoryBuildingService _historyBuildingService;
    private readonly DeferredQueuePickService _deferredQueuePickService;
    
    public DeferredQueueHistoryBuildingService(HistoryBuildingService historyBuildingService, 
        DeferredQueuePickService deferredQueuePickService)
    {
        _historyBuildingService = historyBuildingService;
        _deferredQueuePickService = deferredQueuePickService;
    }

    public async Task PushBuildHistoryTask(string entityType, Guid userId)
    {
        var entityTypeKey = $"BuildHistory:{entityType}";
        await _deferredQueuePickService.PushAsync(entityTypeKey, userId.ToString());
    }
    
    // entityType: Movie, Collection
    public async Task ReBuildHistoryForSelectQueueAsync(string entityType, CancellationToken ct = default)
    {
        var entityTypeKey = $"BuildHistory:{entityType}";
        var queueItems = await _deferredQueuePickService.PullIdsAsync(entityTypeKey);

        var userIds = queueItems.StrArrToGuidArr();
        
        foreach (var userId in userIds)
        {
            await _historyBuildingService.HandleBuildAsync(entityType, userId, ct);
        }
    }

    public async Task ReBuildHistoryForAllQueueAsync(CancellationToken ct = default)
    {
        await ReBuildHistoryForSelectQueueAsync("Movie", ct);
        await ReBuildHistoryForSelectQueueAsync("Collection", ct);
    }
}