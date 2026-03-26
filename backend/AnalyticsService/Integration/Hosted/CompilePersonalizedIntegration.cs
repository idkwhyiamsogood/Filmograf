using System.ComponentModel.DataAnnotations;
using Filmograf.AnalyticsService.Services.Personalized;
using Filmograf.BaseLibrary.Integrations;
using Filmograf.BaseLibrary.Integrations.Payload;
using RabbitMQ.Client;

namespace Filmograf.AnalyticsService.Integration.Hosted;

public class CompilePersonalizedIntegrationRequest : IntegrationRequestPayloadBase
{
    [RegularExpression("^(Movie|Collection)$")]
    public string EntityType { get; set; }
    
    public Guid UserId { get; set; }
}

public class CompilePersonalizedIntegrationContext : IntegrationContextBase
{
    public PersonalizedService PersonalizedService { get; set; }
    
    public CompilePersonalizedIntegrationContext(PersonalizedService personalizedService)
    {
        PersonalizedService = personalizedService;
    }
}

public class CompilePersonalizedIntegration : NoAskIntegrationBase<CompilePersonalizedIntegrationRequest, 
    CompilePersonalizedIntegrationContext>
{
    public CompilePersonalizedIntegration(IChannel channel, string actionName) : base(channel, actionName)
    {
    }

    protected override async Task ProcessingAsync(IntegrationRequest request, CompilePersonalizedIntegrationRequest? payload,
        CompilePersonalizedIntegrationContext context)
    {
        await context.PersonalizedService.HandleCompileChartAsync(payload.EntityType, payload.UserId);
    }
}