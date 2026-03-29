using System.ComponentModel.DataAnnotations;
using Filmograf.BaseLibrary.Integrations;
using Filmograf.BaseLibrary.Integrations.Payload;
using Filmograf.ParsingService.Services;
using RabbitMQ.Client;

namespace Filmograf.ParsingService.Integration.Hosted;

public class ParseOneMovieDetailsIntegrationRequestPayload : IntegrationRequestPayloadBase
{
    [RegularExpression("^(IMDb|Kinopoisk)$")]
    public string Source { get; set; }
    
    public string MovieId { get; set; }
    
    public string Url { get; set; }
}

public class ParseOneMovieDetailsIntegrationContext : IntegrationContextBase
{
    public MoviesParserService MoviesParserService { get; set; }

    public ParseOneMovieDetailsIntegrationContext(MoviesParserService moviesParserService)
    {
        MoviesParserService = moviesParserService;
    }
}

public class ParseOneMovieDetailsIntegration : NoAskIntegrationBase<ParseOneMovieDetailsIntegrationRequestPayload, 
    ParseOneMovieDetailsIntegrationContext>
{
    public ParseOneMovieDetailsIntegration(IChannel channel, string actionName) : base(channel, actionName)
    {
    }

    protected override async Task ProcessingAsync(IntegrationRequest request, ParseOneMovieDetailsIntegrationRequestPayload? payload,
        ParseOneMovieDetailsIntegrationContext context)
    {
        await context.MoviesParserService.HandleParseOneMovieAsync(payload.Source, payload.MovieId, payload.Url);
    }
}