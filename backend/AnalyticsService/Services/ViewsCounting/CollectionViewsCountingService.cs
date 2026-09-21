using Filmograf.AnalyticsService.DataAccess.Repositories;
using Filmograf.BaseLibrary.DataAccess.Repositories;
using Filmograf.BaseLibrary.Services;

namespace Filmograf.AnalyticsService.Services.ViewsCounting;

public class CollectionViewsCountingService
{
    private readonly MissionPlannerService _missionPlannerService;
    private readonly CollectionsClicksAnalyticRepository _clicksAnalyticRepository;
    private readonly CollectionRepository _collectionRepository;

    public CollectionViewsCountingService(MissionPlannerService missionPlannerService, 
        CollectionsClicksAnalyticRepository clicksAnalyticRepository, CollectionRepository collectionRepository)
    {
        _missionPlannerService = missionPlannerService;
        _clicksAnalyticRepository = clicksAnalyticRepository;
        _collectionRepository = collectionRepository;
    }

    public async Task HandleCountAsync(string collectionId)
    {
        var missionName = $"Collection:ViewsCounting:{collectionId}";
        var hasLastCounting = await _missionPlannerService.HasLastMissionAsync(missionName);
        if (hasLastCounting) return;
        
        var collection = await _collectionRepository.GetByIdAsync(collectionId);
        if (collection == null) return;
        
        var clicksCount = await _clicksAnalyticRepository.CountClicksByCollectionAsync(collectionId);
        collection.ViewsCount = clicksCount;

        await _collectionRepository.UpdateAsync(collectionId, collection);
    }
}