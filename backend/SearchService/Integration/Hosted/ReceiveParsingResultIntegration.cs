using Filmograf.BaseLibrary.Integrations;
using Filmograf.BaseLibrary.Integrations.Payload;
using Filmograf.BaseLibrary.Models.Types;
using Filmograf.SearchService.Services;
using RabbitMQ.Client;

namespace Filmograf.SearchService.Integration.Hosted;

public class ReceiveParsingResultIntegrationRequestPayload : IntegrationRequestPayloadBase
{
    public string TargetRoomId { get; set; }
    public string[] MovieIds { get; set; }
}

public class ReceiveParsingResultIntegrationContext : IntegrationContextBase
{
    public SearchParsingReceiverService SearchParsingReceiverService { get; set; }
    
    public ReceiveParsingResultIntegrationContext(SearchParsingReceiverService searchParsingReceiverService)
    {
        SearchParsingReceiverService = searchParsingReceiverService;
    }
}

public class ReceiveParsingResultIntegration : NoAskIntegrationBase<ReceiveParsingResultIntegrationRequestPayload, ReceiveParsingResultIntegrationContext>
{
    public ReceiveParsingResultIntegration(IChannel channel, string actionName) : base(channel, actionName)
    {
    }

    protected override async Task ProcessingAsync(IntegrationRequest request, ReceiveParsingResultIntegrationRequestPayload? payload,
        ReceiveParsingResultIntegrationContext context)
    {
        await context.SearchParsingReceiverService.HandleParsingResultAsync(payload.TargetRoomId, payload.MovieIds);
    }
}