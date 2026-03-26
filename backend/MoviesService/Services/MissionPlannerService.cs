using Filmograf.MoviesService.Caching;
using Filmograf.MoviesService.Models.Types;

namespace Filmograf.MoviesService.Services;

public class MissionPlannerService
{
    private readonly MissionPlannerCache _missionPlannerCache;

    public MissionPlannerService(MissionPlannerCache missionPlannerCache)
    {
        _missionPlannerCache = missionPlannerCache;
    }

    public async Task<bool> CheckLastMissionAsync(string chartType)
    {
        // проверяем, не настало ли время чекнуть
        var parsingLast = await _missionPlannerCache.GetLastAsync(chartType);
        
        // проверяем, не чекаем ли прямо щас
        var parsingTask = await _missionPlannerCache.GetTaskAsync(chartType);
        
        if (parsingLast != null || parsingTask != null) return false;

        // отмечаем, что прямо сейчас чекаем
        var newParsingTask = new MissionTaskCache();
        await _missionPlannerCache.SetTaskAsync(chartType, newParsingTask);

        return true;
    }

    public async Task CompleteMissionAsync(string chartType)
    {
        var newParsingLast = new MissionTaskCache();
        await _missionPlannerCache.SetLastAsync(chartType, newParsingLast);
        await _missionPlannerCache.RemoveTaskAsync(chartType);
    }
}