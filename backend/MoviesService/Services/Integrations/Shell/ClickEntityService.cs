using Filmograf.BaseLibrary.Integrations.Requested;
using Filmograf.MoviesService.Integration.Requested;

namespace Filmograf.MoviesService.Services.Integrations.Shell;

public class ClickEntityService
{
    private readonly IRabbitMqRequestedService _rabbitMqService;
    
    public ClickEntityService(IRabbitMqRequestedService rabbitMqService)
    {
        _rabbitMqService = rabbitMqService;
    }
    
    // entityType: Movie|Collection
    public async Task CheckEntityClickAsync(string entityType, string entityId, Guid userId)
    {
        var request = new ClickEntityIntegrationRequest
        {
            EntityType = entityType,
            EntityId = entityId,
            UserId = userId
        };
        
        await _rabbitMqService.SendNoReplyAsync("click_entity", "movies_to_analytics", request);
    }
}