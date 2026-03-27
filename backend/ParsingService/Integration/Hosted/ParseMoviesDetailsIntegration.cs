using System.ComponentModel.DataAnnotations;
using Filmograf.BaseLibrary.Integrations;
using Filmograf.BaseLibrary.Integrations.Payload;
using Filmograf.BaseLibrary.Models.IntegrationExceptions;
using Filmograf.BaseLibrary.Models.Repo;
using Filmograf.ParsingService.Services;
using RabbitMQ.Client;

namespace Filmograf.ParsingService.Integration.Hosted;

public class ParseMoviesDetailsIntegrationRequestPayload : IntegrationRequestPayloadBase
{
    [RegularExpression("^(IMDb|Kinopoisk)$")]
    public string Source { get; set; }
    
    public MovieRepo[] Movies { get; set; }
}

public class ParseMoviesDetailsIntegrationContext : IntegrationContextBase
{
    public MoviesParserService MoviesParserService { get; set; }

    public ParseMoviesDetailsIntegrationContext(MoviesParserService moviesParserService)
    {
        MoviesParserService = moviesParserService;
    }
}

public class ParseMoviesDetailsIntegration : NoAskIntegrationBase<ParseMoviesDetailsIntegrationRequestPayload, 
    ParseMoviesDetailsIntegrationContext>
{
    public ParseMoviesDetailsIntegration(IChannel channel, string actionName) : base(channel, actionName)
    {
    }

    protected override async Task ProcessingAsync(IntegrationRequest request, ParseMoviesDetailsIntegrationRequestPayload? payload,
        ParseMoviesDetailsIntegrationContext context)
    {
        if (payload == null) 
            throw new EmptyPayloadIntegrationException(_actionName);

        await context.MoviesParserService.HandleParseDetailsAsync(payload.Source, payload.Movies);
    }
}