using Filmograf.BaseLibrary.Integrations.Requested;
using Filmograf.MoviesService.Integration.Requested;

namespace Filmograf.MoviesService.Services;

public class PersonalizedService
{
    private readonly IRabbitMqRequestedService _rabbitMqService;

    public PersonalizedService(IRabbitMqRequestedService rabbitMqService)
    {
        _rabbitMqService = rabbitMqService;
    }

    // entityType: Movie, Collection
    public async Task CompilePersonalizedAsync(string entityType, Guid userId)
    {
        var request = new CompilePersonalizedIntegrationRequest()
        {
            EntityType = entityType,
            UserId = userId
        };
        
        await _rabbitMqService.SendNoReplyAsync("compile_personalized", "movies_to_analytics", request);
    }
}