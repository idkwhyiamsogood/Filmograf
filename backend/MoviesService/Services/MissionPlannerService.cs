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
        // проверяем, не настало ли время чекнуть еще раз imdb и кинопоиск
        var parsingLast = await _missionPlannerCache.GetLastAsync(chartType);
        
        // проверяем, не чекаем ли площадки прямо щас
        var parsingTask = await _missionPlannerCache.GetTaskAsync(chartType);
        
        if (parsingLast != null || parsingTask != null) return false;

        // отмечаем, что прямо сейчас чекаем площадки
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