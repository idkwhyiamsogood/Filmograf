using Filmograf.BaseLibrary.Integrations.Requested;
using Filmograf.BaseLibrary.Models.IntegrationExceptions;
using Filmograf.BaseLibrary.Models.Repo;
using Filmograf.BaseLibrary.Models.Types;
using Filmograf.ParsingService.Integration.Requested;
using Filmograf.ParsingService.Services.IMDb;

namespace Filmograf.ParsingService.Services;

public class MoviesParserService
{
    private delegate Task<IEnumerable<RawMovieInfo>> HandleParseDelegate(string url);
    
    private readonly IMDbParserService _imDbParser;
    private readonly Dictionary<string, HandleParseDelegate> _parseDelegates;
    private readonly IRabbitMqRequestedService _rabbitMqService;
    
    public MoviesParserService(IMDbParserService imDbParser, IRabbitMqRequestedService rabbitMqService)
    {
        _imDbParser = imDbParser;
        _rabbitMqService = rabbitMqService;
        
        _parseDelegates = new Dictionary<string, HandleParseDelegate>
        {
            // Если метод ParseMoviesFromPage статический, обращаемся через класс
            // Если экземплярный — через _imDbParser
            { "IMDb", _imDbParser.ParseMoviesFromPage }
        };
    }
    
    public async Task<IEnumerable<RawMovieInfo>> HandleParseAsync(string source, string url, bool distinctAfter)
    {
        if (!_parseDelegates.TryGetValue(source, out var parseMethod))
        {
            throw new IntegrationException($"Источник '{source}' не поддерживается.");
        }
        
        var movies = await parseMethod(url);
        if (!distinctAfter) return movies;

        var request = new FilmsDistinctIntegrationRequest
        { Movies = movies.ToArray() };

        await _rabbitMqService.SendNoReplyAsync("distinct_films", "parser_to_movies", request);
        return movies;
    }

    // private async Task<Movie> ExtractMovieAsync(IPage page)
    // {
    //     throw new NotImplementedException();
    // }
    
    // public static async Task<Movie> ParseMovieFromPage()
    // {
    //     throw new NotImplementedException();
    // }
}