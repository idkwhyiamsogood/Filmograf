using Filmograf.BaseLibrary.Models.Dto;
using Filmograf.BaseLibrary.Services;

namespace Filmograf.CollectionsService.Services;

public class CollectionTopPicksService
{
    private readonly TopPicksService _topPicksService;
    private readonly MissionPlannerService _missionPlannerService;
    
    private readonly PersonalizedService _personalizedService;
    private readonly CollectionsChartService _collectionsChartService;

    public CollectionTopPicksService(TopPicksService topPicksService, MissionPlannerService missionPlannerService,
        PersonalizedService personalizedService, CollectionsChartService collectionsChartService)
    {
        _topPicksService = topPicksService;
        _missionPlannerService = missionPlannerService;
        _personalizedService = personalizedService;
        _collectionsChartService = collectionsChartService;
    }

    public async Task<EntitiesListResponseDto> GetPopularAsync(PaginationQueryDto pagination)
    {
        var chart = await _topPicksService.GetFromChartAsync(pagination, "FilmTopCollections");

        var hasMission = await _missionPlannerService.CheckLastMissionOrTaskAsync("FilmTopCollections");
        if (hasMission) await _collectionsChartService.CompileChartAsync();
        
        return chart;
    }

    public async Task<EntitiesListResponseDto> GetUserRecommendedChartAsync(PaginationQueryDto pagination, Guid userId)
    {
        var userKey = _topPicksService.GetUserKey("Collection", userId);
        var chart = await _topPicksService.GetFromChartAsync(pagination, userKey);
        
        var hasMission = await _missionPlannerService.CheckLastMissionOrTaskAsync(userKey);
        if (hasMission) await _personalizedService.CompilePersonalizedAsync("Collection", userId);

        return chart;
    }
}