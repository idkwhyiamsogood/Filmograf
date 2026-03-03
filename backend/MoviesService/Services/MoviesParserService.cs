using Filmograf.BaseLibrary.Integrations.Payload;
using Filmograf.BaseLibrary.Integrations.Requested;
using Filmograf.BaseLibrary.Models.Repo;
using Filmograf.BaseLibrary.Models.Types;
using Filmograf.MoviesService.Integration.Requested;
using Filmograf.MoviesService.Services.Integrations;

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
        await _rabbitMqService.SendNoReplyAsync("parse_top_films", "movies_to_parser",
            new ParseTopFilmsRequestIntegration());
    }
}