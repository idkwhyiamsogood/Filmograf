using Filmograf.BaseLibrary.Integrations.Requested;
using Filmograf.CollectionsService.Integration.Requested;

namespace Filmograf.CollectionsService.Services;

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
        
        await _rabbitMqService.SendNoReplyAsync("compile_personalized", "collections_to_analytics", request);
    }
}