using Filmograf.BaseLibrary.Integrations.Requested;
using Filmograf.MoviesService.Integration.Requested;
using Filmograf.MoviesService.Util;

namespace Filmograf.MoviesService.Services;

public class MoviesParserService
{
    private readonly IRabbitMqRequestedService _rabbitMqService;

    public MoviesParserService(IRabbitMqRequestedService rabbitMqService)
    {
        _rabbitMqService = rabbitMqService;
    }

    public async Task ParseMoviesAsync()
    {
        var request = new ParseTopFilmsIntegrationRequest
        {
            Source = "IMDb",
            Url = LocalAppSettingsUtil.AppSettings.IMDbSettings.TopChartLink,
            SendDistinctRequest = true
        };
        
        await _rabbitMqService.SendNoReplyAsync("parse_top_films", "movies_to_parser", request);
    }
}