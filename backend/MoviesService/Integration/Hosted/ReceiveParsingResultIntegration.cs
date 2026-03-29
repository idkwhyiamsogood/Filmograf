using Filmograf.BaseLibrary.Integrations;
using Filmograf.BaseLibrary.Integrations.Payload;
using Filmograf.BaseLibrary.Models.Types;
using Filmograf.MoviesService.Services;
using RabbitMQ.Client;

namespace Filmograf.MoviesService.Integration.Hosted;

public class ReceiveParsingResultIntegrationRequestPayload : IntegrationRequestPayloadBase
{
    public string TargetRoomId { get; set; }
    public RawMovieInfo[] MovieInfos { get; set; }
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
        await context.SearchParsingReceiverService.DistinctMoviesAsync(payload.TargetRoomId, payload.MovieInfos);
    }
}