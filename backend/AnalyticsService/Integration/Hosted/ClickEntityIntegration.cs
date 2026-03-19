using System.ComponentModel.DataAnnotations;
using Filmograf.AnalyticsService.Services;
using Filmograf.BaseLibrary.Integrations;
using Filmograf.BaseLibrary.Integrations.Payload;
using RabbitMQ.Client;

namespace Filmograf.AnalyticsService.Integration.Hosted;

public class ClickEntityIntegrationRequestPayload : IntegrationRequestPayloadBase
{
    [RegularExpression("^(Movie|Collection)$")]
    public string EntityType { get; set; }
    
    public Guid UserId { get; set; }
    public string EntityId { get; set; }
}

public class ClickEntityIntegrationContext : IntegrationContextBase
{
    public readonly ClicksService ClicksService;

    public ClickEntityIntegrationContext(ClicksService clicksService)
    {
        ClicksService = clicksService;
    }
}

public class ClickEntityIntegration : NoAskIntegrationBase<ClickEntityIntegrationRequestPayload, ClickEntityIntegrationContext>
{
    public ClickEntityIntegration(IChannel channel, string actionName) : base(channel, actionName)
    {
    }

    protected override async Task ProcessingAsync(IntegrationRequest request, ClickEntityIntegrationRequestPayload? payload,
        ClickEntityIntegrationContext context)
    {
        await context.ClicksService.HandleClickAsync(payload.EntityType, payload.EntityId, payload.UserId);
    }
}