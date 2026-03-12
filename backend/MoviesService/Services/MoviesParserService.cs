using Filmograf.BaseLibrary.DataAccess.Repositories;
using Filmograf.BaseLibrary.Integrations.Requested;
using Filmograf.MoviesService.Caching;
using Filmograf.MoviesService.Integration.Requested;
using Filmograf.MoviesService.Models.Types;
using Filmograf.MoviesService.Util;

namespace Filmograf.MoviesService.Services;

public class MoviesParserService
{
    private readonly IRabbitMqRequestedService _rabbitMqService;
    private readonly ParsingPlannerCache _parsingPlannerCache;

    public MoviesParserService(IRabbitMqRequestedService rabbitMqService, MovieRepository movieRepository,
        ParsingPlannerCache parsingPlannerCache)
    {
        _rabbitMqService = rabbitMqService;
        _parsingPlannerCache = parsingPlannerCache;
    }

    public async Task ParseMoviesAsync(string chartType, string url, bool distinct = true, bool updateTopPick = true)
    {
        var request = new ParseTopFilmsIntegrationRequest
        {
            Source = chartType,
            Url = url,
            SendDistinctRequest = distinct,
            SendUpdateTopPickRequest = updateTopPick
        };
        
        await _rabbitMqService.SendNoReplyAsync("parse_top_films", "movies_to_parser", request);
    }

    public async Task ParseMoviesAsync(string chartType)
    {
        await ParseMoviesAsync(chartType, LocalAppSettingsUtil.AppSettings.IMDbSettings.TopChartLink);
    }
    
    public async Task CheckLastParsingAsync(string chartType)
    {
        // проверяем, не настало ли время чекнуть еще раз imdb и кинопоиск
        var parsingLast = await _parsingPlannerCache.GetLastAsync(chartType);
        
        // проверяем, не чекаем ли площадки прямо щас
        var parsingTask = await _parsingPlannerCache.GetTaskAsync(chartType);
        
        if (parsingLast != null || parsingTask != null) return;

        // отмечаем, что прямо сейчас чекаем площадки
        var newParsingTask = new ParsingTaskCache();
        await _parsingPlannerCache.SetTaskAsync(chartType, newParsingTask);
        
        // создаем запрос на парсинг
        await ParseMoviesAsync(chartType);
    }

    public async Task CompleteParsingAsync(string chartType)
    {
        var newParsingLast = new ParsingTaskCache();
        await _parsingPlannerCache.SetLastAsync(chartType, newParsingLast);
        await _parsingPlannerCache.RemoveTaskAsync(chartType);
    }
}