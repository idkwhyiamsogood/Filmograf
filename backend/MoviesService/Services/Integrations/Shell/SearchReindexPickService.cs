using Filmograf.BaseLibrary.Integrations.Requested;
using Filmograf.MoviesService.Integration.Requested;

namespace Filmograf.MoviesService.Services.Integrations.Shell;

public class SearchReindexPickService
{
    private readonly IRabbitMqRequestedService _rabbitMqService;
    
    public SearchReindexPickService(IRabbitMqRequestedService rabbitMqService)
    {
        _rabbitMqService = rabbitMqService;
    }
    
    public async Task PickMovieReindexAsync(string movieId)
    {
        var request = new PickMovieUpdateIntegrationRequest
        { MovieId = movieId };
        
        await _rabbitMqService.SendNoReplyAsync("pick_movie", "movies_to_searchIndexer", request);
    }
}