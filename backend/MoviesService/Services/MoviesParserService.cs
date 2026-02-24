using Filmograf.BaseLibrary.Integrations.Payload;
using Filmograf.BaseLibrary.Integrations.Requested;
using Filmograf.BaseLibrary.Models.Types;
using Filmograf.MoviesService.Services.Integrations;

namespace Filmograf.MoviesService.Services;

public class MoviesParserService
{
    private readonly IRabbitMqRequestedService _rabbitMqService;

    public MoviesParserService(IRabbitMqRequestedService rabbitMqService)
    {
        _rabbitMqService = rabbitMqService;
    }

    public async Task<List<Movie>> ParseMoviesAsync(string url)
    {
        // todo
        throw new NotImplementedException();
    }
}