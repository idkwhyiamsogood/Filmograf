using Filmograf.BaseLibrary.DataAccess.Repositories;
using Filmograf.BaseLibrary.Integrations.Requested;
using Filmograf.BaseLibrary.Models.HttpExceptions;
using Filmograf.BaseLibrary.Services;
using Filmograf.MoviesService.Integration.Requested;
using Filmograf.MoviesService.Util;

namespace Filmograf.MoviesService.Services;

public class MoviesParserService
{
    private readonly IRabbitMqRequestedService _rabbitMqService;
    private readonly MissionPlannerService _missionPlannerService;
    private readonly MovieRepository _movieRepository;

    public MoviesParserService(IRabbitMqRequestedService rabbitMqService, MissionPlannerService missionPlannerService,
        MovieRepository movieRepository)
    {
        _rabbitMqService = rabbitMqService;
        _missionPlannerService = missionPlannerService;
        _movieRepository = movieRepository;
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
        var parsingLast = await _missionPlannerService.CheckLastMissionOrTaskAsync(chartType);
        if (!parsingLast) return;

        // создаем запрос на парсинг
        await ParseMoviesAsync(chartType);
    }

    public async Task CompleteParsingAsync(string chartType)
    {
        await _missionPlannerService.CompleteMissionAsync(chartType);
    }

    public async Task ParseOneMovieDetailsAsync(string movieId)
    {
        var exitingMovie = await _movieRepository.GetByIdAsync(movieId);
        if (exitingMovie == null) throw new NotFoundHttpException("MovieNotFound");
        
        var request = new ParseOneMovieDetailsIntegrationRequestPayload
        {
            Source = "IMDb",
            Url = exitingMovie.MovieLink,
            MovieId = movieId
        };
        
        await _rabbitMqService.SendNoReplyAsync("parse_one_details", "movies_to_parser", request);
    }

    // todo: костыть ебанутый, в проде убрать и забыть как страшный сон ибо это пиздец ребзеее
    public async Task<int> FixParsingBugsAsync()
    {
        var count = 0;
        for (int i = 0; i < 68; i++)
        {
            var allMovies = await _movieRepository.GetAllAsync(i*100, 100);
            var tasks = new List<Task>();

            foreach (var movie in allMovies)
            {
                if (movie.AgeLimit != 0) continue;
                tasks.Add(ParseOneMovieDetailsAsync(movie.Id));
                count++;
            }

            await Task.WhenAll(tasks);
        }
        return count;
    }
}