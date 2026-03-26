using Filmograf.BaseLibrary.Caching;
using Filmograf.BaseLibrary.DataAccess.Repositories;
using Filmograf.BaseLibrary.Models.Dto;
using Filmograf.BaseLibrary.Models.Repo;
using Filmograf.BaseLibrary.Util;

namespace Filmograf.BaseLibrary.Services;

public class TopPicksService
{
    private readonly TopPicksRepository _topPicksRepository;
    private readonly TopPickCaching _topPickCaching;
    
    public TopPicksService(TopPicksRepository topPicksRepository, TopPickCaching topPickCaching)
    {
        _topPicksRepository = topPicksRepository;
        _topPickCaching = topPickCaching;
    }

    private async Task<EntitiesListResponseDto> CreateCacheForChartAsync(PaginationQueryDto pagination, string chartType)
    {
        var chartRepo = await _topPicksRepository.GetByChartTypeAsync(chartType);
        if (chartRepo == null) return new EntitiesListResponseDto();
        
        var sortedChartIds = chartRepo.Chart
            .OrderBy(pair => pair.Key)
            .Select(pair => pair.Value)
            .ToList();
        
        var pagedIds = sortedChartIds
            .Skip(pagination.Page * pagination.Count)
            .Take(pagination.Count)
            .ToList();
        
        if (!pagedIds.Any()) return new EntitiesListResponseDto();

        return new EntitiesListResponseDto { Ids = pagedIds.ToArray() };
    }

    public string GetUserKey(string chartType, Guid userId)
    {
        return $"{chartType}:user:{userId.ToString()}";
    }

    public async Task<EntitiesListResponseDto> GetFromUserChartAsync(PaginationQueryDto pagination, Guid userId, string chartType)
    {
        var chartKey = GetUserKey(chartType, userId);
        return await GetFromChartAsync(pagination, chartKey);
    }
    
    public async Task<EntitiesListResponseDto> GetFromChartAsync(PaginationQueryDto pagination, string chartType)
    {
        var method = async () => await CreateCacheForChartAsync(pagination, chartType);
        return await _topPickCaching.CachingTopPickAsync(chartType, pagination, method);
    }

    public async Task SetUserTopPickAsync(string chartType, Guid userId, Dictionary<int, string> chartDictionary)
    {
        var chartKey = GetUserKey(chartType, userId);
        await SetTopPickAsync(chartKey, chartDictionary);
    }

    public async Task SetTopPickAsync(string chartType, Dictionary<int, string> chartDictionary)
    {
        // получаем существующий топик
        var exitingTopPick = await _topPicksRepository.GetByChartTypeAsync(chartType);
        
        // если нету
        if (exitingTopPick == null)
        {
            // создаем новый
            var newTopPick = new TopPicksRepo
            {
                Id = MongoDbUtil.GenerateNewId(),
                ChartType = chartType, 
                Chart = chartDictionary
            };

            // сохраняем
            await _topPicksRepository.CreateAsync(newTopPick);
            await _topPickCaching.RemoveCachingTopPickRootAsync(chartType);
            return;
        }

        // если уже есть запись для такого топика - обновляем данные
        exitingTopPick.Chart = chartDictionary;
        await _topPicksRepository.UpdateAsync(exitingTopPick.Id, exitingTopPick);
        
        // удяляем фулл кеш для топика
        await _topPickCaching.RemoveCachingTopPickRootAsync(chartType);
    }
}