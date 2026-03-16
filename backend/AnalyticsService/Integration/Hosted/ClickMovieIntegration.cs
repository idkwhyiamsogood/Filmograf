using System.ComponentModel.DataAnnotations;
using Filmograf.AnalyticsService.Services;
using Filmograf.BaseLibrary.Integrations;
using Filmograf.BaseLibrary.Integrations.Payload;
using RabbitMQ.Client;

namespace Filmograf.AnalyticsService.Integration.Hosted;

public class ClickMovieIntegrationRequestPayload : IntegrationRequestPayloadBase
{
    [RegularExpression("^(Movie|Collection)$")]
    public string EntityType { get; set; }
    
    public Guid UserId { get; set; }
    public string EntityId { get; set; }
}

public class ClickMovieIntegrationContext : IntegrationContextBase
{
    public MovieClicksService MovieClicksService { get; set; }
}

public class ClickMovieIntegration : NoAskIntegrationBase<ClickMovieIntegrationRequestPayload, ClickMovieIntegrationContext>
{
    public ClickMovieIntegration(IChannel channel, string actionName) : base(channel, actionName)
    {
    }

    protected override Task ProcessingAsync(IntegrationRequest request, ClickMovieIntegrationRequestPayload? payload,
        ClickMovieIntegrationContext context)
    {
        throw new NotImplementedException();
    }
}