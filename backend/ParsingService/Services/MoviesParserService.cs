using Filmograf.BaseLibrary.Integrations.Requested;
using Filmograf.BaseLibrary.Models.IntegrationExceptions;
using Filmograf.BaseLibrary.Models.Repo;
using Filmograf.BaseLibrary.Models.Types;
using Filmograf.ParsingService.Integration.Requested;
using Filmograf.ParsingService.Services.IMDb;
using Filmograf.ParsingService.Services.Kinopoisk;

namespace Filmograf.ParsingService.Services;

public class MoviesParserService
{
    private delegate Task<IEnumerable<RawMovieInfo>> HandleParseDelegate(string url);

    private delegate Task<IEnumerable<MovieDetailsParseResult>> HandleParseDetailsDelegate(List<MovieRepo> movieRepos);

    private delegate Task<RawMovieInfo> HandleParseOneDelegate(string url);

    private readonly IMDbParserService _imDbParser;
    private readonly IMDbDetailsParserService _imDbDetailsParser;
    private readonly IMDbOneMovieParserService _imDbOneMovieParser;
    private readonly KinopoiskParserService _kinopoiskParser;
    private readonly IRabbitMqRequestedService _rabbitMqService;
    
    private readonly Dictionary<string, HandleParseDelegate> _parseDelegates;
    private readonly Dictionary<string, HandleParseDetailsDelegate> _parseDetailsDelegates;
    private readonly Dictionary<string, HandleParseOneDelegate> _parseOneDetailsDelegates;
    
    public MoviesParserService(IMDbParserService imDbParser, IMDbDetailsParserService imDbDetailsParser,
        IRabbitMqRequestedService rabbitMqService, KinopoiskParserService kinopoiskParser, IMDbOneMovieParserService imDbOneMovieParser)
    {
        _imDbParser = imDbParser;
        _imDbDetailsParser = imDbDetailsParser;
        _rabbitMqService = rabbitMqService;
        _kinopoiskParser = kinopoiskParser;
        _imDbOneMovieParser = imDbOneMovieParser;
        
        _parseDelegates = new Dictionary<string, HandleParseDelegate>
        {
            { "IMDb", _imDbParser.ParseMoviesFromPage },
            { "Kinopoisk", _kinopoiskParser.ParseMoviesFromPage },
        };
        
        _parseDetailsDelegates = new Dictionary<string, HandleParseDetailsDelegate>
        {
            { "IMDb", _imDbDetailsParser.ParseMoviesDetailsAsync }
        };
        
        _parseOneDetailsDelegates = new Dictionary<string, HandleParseOneDelegate>
        {
            { "IMDb", _imDbOneMovieParser.ParseMovieFromPage }
        };
    }
    
    public async Task<IEnumerable<RawMovieInfo>> HandleParseAsync(string source, string url, bool distinctAfter, bool updateTopPickAfter)
    {
        if (!_parseDelegates.TryGetValue(source, out var parseMethod))
        {
            throw new IntegrationException($"Источник '{source}' не поддерживается.");
        }
        
        var movies = await parseMethod(url);

        if (distinctAfter)
        {
            var distinctRequest = new MoviesDistinctIntegrationRequest { Movies = movies.ToArray(), Source = source };
            await _rabbitMqService.SendNoReplyAsync("distinct_films", "parser_to_movies", distinctRequest);
        }

        if (updateTopPickAfter)
        {
            var completeParsingRequest = new CompleteParsingIntegrationRequest
                { Movies = movies.ToArray(), Source = source };
            await _rabbitMqService.SendNoReplyAsync("complete_parsing", "parser_to_movies", completeParsingRequest);
        }

        return movies;
    }

    public async Task<IEnumerable<MovieDetailsParseResult>> HandleParseDetailsAsync(string source, MovieRepo[] movies)
    {
        if (!_parseDetailsDelegates.TryGetValue(source, out var parseDetailsMethod))
        {
            throw new IntegrationException($"Источник '{source}' не поддерживается.");
        }

        var detailsData = await parseDetailsMethod(movies.ToList());

        var request = new MoviesApplyDetailsIntegrationRequest 
        { DetailsInfo = detailsData.ToArray() };
        
        await _rabbitMqService.SendNoReplyAsync("apply_movies_details", "parser_to_movies", request);
        return detailsData;
    }

    public async Task<RawMovieInfo> HandleParseOneMovieAsync(string source, string movieId,
        string url)
    {
        if (!_parseOneDetailsDelegates.TryGetValue(source, out var parseDetailsMethod))
        {
            throw new IntegrationException($"Источник '{source}' не поддерживается.");
        }
        
        var detailsData = await parseDetailsMethod(url);
        
        var request = new OneMovieApplyDetailsIntegrationRequestPayload() 
        { MovieId = movieId, Info = detailsData };
        
        await _rabbitMqService.SendNoReplyAsync("apply_one_movie_details", "parser_to_movies", request);
        return detailsData;
    }
}