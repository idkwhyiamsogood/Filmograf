using System.ComponentModel.DataAnnotations;
using Filmograf.BaseLibrary.Integrations;
using Filmograf.BaseLibrary.Integrations.Payload;
using Filmograf.BaseLibrary.Models.IntegrationExceptions;
using Filmograf.BaseLibrary.Models.Types;
using Filmograf.MoviesService.Services;
using Filmograf.MoviesService.Services.Integrations.Shell;
using Filmograf.MoviesService.Services.Movies;
using RabbitMQ.Client;

namespace Filmograf.MoviesService.Integration.Hosted;

public class CompleteParsingIntegrationRequestPayload : IntegrationRequestPayloadBase
{
    [RegularExpression("^(IMDb|Kinopoisk)$")]
    public string Source { get; set; }
    
    public RawMovieInfo[] Movies { get; set; }
}

public class CompleteParsingIntegrationContext : IntegrationContextBase
{
    public MoviesParserService MoviesParserService { get; set; }
    public MovieTopPicksService MovieTopPicksService { get; set; }

    public CompleteParsingIntegrationContext(MoviesParserService moviesParserService, MovieTopPicksService movieTopPicksService)
    {
        MoviesParserService = moviesParserService;
        MovieTopPicksService = movieTopPicksService;
    }
}

public class CompleteParsingIntegration : NoAskIntegrationBase<CompleteParsingIntegrationRequestPayload, 
    CompleteParsingIntegrationContext>
{
    public CompleteParsingIntegration(IChannel channel, string actionName) : base(channel, actionName)
    {
    }

    protected override async Task ProcessingAsync(IntegrationRequest request, CompleteParsingIntegrationRequestPayload? payload,
        CompleteParsingIntegrationContext context)
    {
        if (payload == null) 
            throw new EmptyPayloadIntegrationException(_actionName);

        await context.MoviesParserService.CompleteParsingAsync(payload.Source);
        await context.MovieTopPicksService.UpdateMoviesChartAsync(payload.Source, payload.Movies);
    }
}