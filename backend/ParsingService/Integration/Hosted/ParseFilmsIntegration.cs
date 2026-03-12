using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using Filmograf.BaseLibrary.Integrations;
using Filmograf.BaseLibrary.Integrations.Payload;
using Filmograf.BaseLibrary.Models.IntegrationExceptions;
using Filmograf.ParsingService.Services;
using RabbitMQ.Client;

namespace Filmograf.ParsingService.Integration.Hosted;

public class ParseFilmsIntegrationRequestPayload : IntegrationRequestPayloadBase
{
    [RegularExpression("^(IMDb|Kinopoisk)$")]
    public string Source { get; set; }
    
    public string Url { get; set; }
    
    [DefaultValue(true)]
    public bool SendDistinctRequest { get; set; } = true;

    [DefaultValue(true)]
    public bool SendUpdateTopPickRequest { get; set; } = true;
}

public class ParseFilmsIntegrationContext : IntegrationContextBase
{
    public MoviesParserService MoviesParserService { get; set; }

    public ParseFilmsIntegrationContext(MoviesParserService moviesParserService)
    {
        MoviesParserService = moviesParserService;
    }
}

public class ParseFilmsIntegration : NoAskIntegrationBase<ParseFilmsIntegrationRequestPayload, ParseFilmsIntegrationContext>
{
    public ParseFilmsIntegration(IChannel channel, string actionName) : base(channel, actionName)
    {
    }

    protected override async Task ProcessingAsync(IntegrationRequest request, ParseFilmsIntegrationRequestPayload? payload,
        ParseFilmsIntegrationContext context)
    {
        if (payload == null) 
            throw new EmptyPayloadIntegrationException(_actionName);
        
        var data = await context.MoviesParserService.HandleParseAsync(
            source: payload.Source,
            url: payload.Url,
            distinctAfter: payload.SendDistinctRequest,
            updateTopPickAfter: payload.SendUpdateTopPickRequest
        );
        
        return;
    }
}