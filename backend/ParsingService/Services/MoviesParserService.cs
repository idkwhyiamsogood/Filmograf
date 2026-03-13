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
    
    private readonly IMDbParserService _imDbParser;
    private readonly IMDbDetailsParserService _imDbDetailsParser;
    private readonly KinopoiskParserService _kinopoiskParser;
    private readonly IRabbitMqRequestedService _rabbitMqService;
    
    private readonly Dictionary<string, HandleParseDelegate> _parseDelegates;
    private readonly Dictionary<string, HandleParseDetailsDelegate> _parseDetailsDelegates;
    
    public MoviesParserService(IMDbParserService imDbParser, IMDbDetailsParserService imDbDetailsParser,
        IRabbitMqRequestedService rabbitMqService, KinopoiskParserService kinopoiskParser)
    {
        _imDbParser = imDbParser;
        _imDbDetailsParser = imDbDetailsParser;
        _rabbitMqService = rabbitMqService;
        _kinopoiskParser = kinopoiskParser;
        
        _parseDelegates = new Dictionary<string, HandleParseDelegate>
        {
            // Если метод ParseMoviesFromPage статический, обращаемся через класс
            // Если экземплярный — через _imDbParser
            { "IMDb", _imDbParser.ParseMoviesFromPage },
            { "Kinopoisk", _kinopoiskParser.ParseMoviesFromPage },
        };
        
        _parseDetailsDelegates = new Dictionary<string, HandleParseDetailsDelegate>
        {
            // Если метод ParseMoviesFromPage статический, обращаемся через класс
            // Если экземплярный — через _imDbParser
            { "IMDb", _imDbDetailsParser.ParseMoviesDetailsAsync }
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
            var distinctRequest = new FilmsDistinctIntegrationRequest { Movies = movies.ToArray(), Source = source };
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

        var request = new FilmsApplyDetailsIntegrationRequest 
        { DetailsInfo = detailsData.ToArray() };
        
        await _rabbitMqService.SendNoReplyAsync("apply_films_details", "parser_to_movies", request);
        return detailsData;
    }
}