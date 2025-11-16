using Filmograf.BaseLibrary.Integrations.Payload;
using Filmograf.BaseLibrary.Models.Types;

namespace Filmograf.MoviesService.Services;

public class MoviesParserService
{
    private readonly RabbitMQService _rabbitMqService;

    public MoviesParserService(RabbitMQService rabbitMqService)
    {
        _rabbitMqService = rabbitMqService;
    }

    public async Task<List<Movie>> ParseMoviesAsync(string url)
    {
        var data = await _rabbitMqService.SendRequestAsync<ParseMoviesIntegrationRequestPayload, 
            ParseMoviesIntegrationResponsePayload>(
            "test", 
            new ParseMoviesIntegrationRequestPayload { Url = url }
        );

        return data.Movies;
    }
}