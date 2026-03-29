using Filmograf.BaseLibrary.Integrations;
using Filmograf.BaseLibrary.Integrations.Payload;
using Filmograf.BaseLibrary.Models.Dto;
using Filmograf.BaseLibrary.Models.Types;
using Filmograf.ParsingService.Services;
using RabbitMQ.Client;

namespace Filmograf.ParsingService.Integration.Hosted;

public class ParseSearchingIntegrationRequestPayload : IntegrationRequestPayloadBase
{
    public string TargetRoomId { get; set; }
    public string Query { get; set; }
    public IntegrationReplyDto[] ReplyProps { get; set; }
}

// не response, ибо будет использоваться как request для реплай consumer-ов 
public class ParseSearchingIntegrationResultPayload : IntegrationRequestPayloadBase
{
    public string TargetRoomId { get; set; }
    public RawMovieInfo[] MovieInfos { get; set; }
}

public class ParseSearchingIntegrationContext : IntegrationContextBase
{
    public SearchService SearchService { get; set; }

    public ParseSearchingIntegrationContext(SearchService searchService)
    {
        SearchService = searchService;
    }
}

public class ParseSearchingIntegration : NoAskIntegrationBase<ParseSearchingIntegrationRequestPayload, ParseSearchingIntegrationContext>
{
    public ParseSearchingIntegration(IChannel channel, string actionName) : base(channel, actionName)
    {
    }

    protected override async Task ProcessingAsync(IntegrationRequest request, ParseSearchingIntegrationRequestPayload? payload,
        ParseSearchingIntegrationContext context)
    {
        await context.SearchService.HandleSearchAsync(payload.TargetRoomId, payload.Query, payload.ReplyProps);
    }
}