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
    private readonly MissionPlannerService _missionPlannerService;

    public MoviesParserService(IRabbitMqRequestedService rabbitMqService, MissionPlannerService missionPlannerService)
    {
        _rabbitMqService = rabbitMqService;
        _missionPlannerService = missionPlannerService;
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
        var parsingLast = await _missionPlannerService.CheckLastMissionAsync(chartType);
        if (!parsingLast) return;

        // создаем запрос на парсинг
        await ParseMoviesAsync(chartType);
    }

    public async Task CompleteParsingAsync(string chartType)
    {
        await _missionPlannerService.CompleteMissionAsync(chartType);
    }
}