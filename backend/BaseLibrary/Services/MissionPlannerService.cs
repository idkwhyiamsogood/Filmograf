using Filmograf.BaseLibrary.Caching;
using Filmograf.BaseLibrary.Models.Types;

namespace Filmograf.BaseLibrary.Services;

public class MissionPlannerService
{
    private readonly MissionPlannerCache _missionPlannerCache;

    public MissionPlannerService(MissionPlannerCache missionPlannerCache)
    {
        _missionPlannerCache = missionPlannerCache;
    }

    public async Task<bool> HasLastMissionAsync(string missionName)
    {
        // проверяем, не настало ли время чекнуть
        var mission = await _missionPlannerCache.GetLastAsync(missionName);

        return mission != null;
    }

    public async Task PinLastMissionAsync(string missionName)
    {
        var newParsingTask = new MissionTaskCache();
        await _missionPlannerCache.SetLastAsync(missionName, newParsingTask);
    }

    
    public async Task<bool> HasCurrentTaskAsync(string missionName)
    {
        // проверяем, не настало ли время чекнуть
        var mission = await _missionPlannerCache.GetTaskAsync(missionName);

        return mission != null;
    }

    public async Task PinCurrentTaskAsync(string missionName)
    {
        var newParsingTask = new MissionTaskCache();
        await _missionPlannerCache.SetTaskAsync(missionName, newParsingTask);
    }

    
    public async Task<bool> CheckLastMissionOrTaskAsync(string missionName)
    {
        // проверяем, не настало ли время чекнуть
        var parsingLast = await _missionPlannerCache.GetLastAsync(missionName);
        
        // проверяем, не чекаем ли прямо щас
        var parsingTask = await _missionPlannerCache.GetTaskAsync(missionName);
        
        if (parsingLast != null || parsingTask != null) return false;

        // отмечаем, что прямо сейчас чекаем
        var newParsingTask = new MissionTaskCache();
        await _missionPlannerCache.SetTaskAsync(missionName, newParsingTask);

        return true;
    }

    public async Task CompleteMissionAsync(string mission)
    {
        var newParsingLast = new MissionTaskCache();
        await _missionPlannerCache.SetLastAsync(mission, newParsingLast);
        await _missionPlannerCache.RemoveTaskAsync(mission);
    }
}