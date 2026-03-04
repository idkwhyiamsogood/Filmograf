using Filmograf.BaseLibrary.DataAccess.Repositories;
using Filmograf.BaseLibrary.Integrations.Requested;
using Filmograf.MoviesService.Integration.Requested;
using Filmograf.MoviesService.Util;

namespace Filmograf.MoviesService.Services;

public class MoviesParserService
{
    private readonly IRabbitMqRequestedService _rabbitMqService;
    private readonly MovieRepository _movieRepository;

    public MoviesParserService(IRabbitMqRequestedService rabbitMqService, MovieRepository movieRepository)
    {
        _rabbitMqService = rabbitMqService;
        _movieRepository = movieRepository;
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

    public async Task ParseTestAsync()
    {
        var movie = await _movieRepository.GetByIdAsync("69a8321797384f43fd6f80d4");
        
        var request = new ParseFilmsDetailsIntegrationRequest()
        {
            Source = "IMDb",
            Movies = new []
            {
                movie
            }
        };
        
        await _rabbitMqService.SendNoReplyAsync("parse_details", "movies_to_parser", request);
    }
}