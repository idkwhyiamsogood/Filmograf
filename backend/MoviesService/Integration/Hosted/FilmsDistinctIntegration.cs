using System.ComponentModel.DataAnnotations;
using Filmograf.BaseLibrary.Integrations;
using Filmograf.BaseLibrary.Integrations.Payload;
using Filmograf.BaseLibrary.Models.IntegrationExceptions;
using Filmograf.BaseLibrary.Models.Types;
using Filmograf.MoviesService.Services;
using RabbitMQ.Client;

namespace Filmograf.MoviesService.Integration.Hosted;

public class FilmsDistinctIntegrationRequestPayload : IntegrationRequestPayloadBase
{
    [RegularExpression("^(IMDb|Kinopoisk)$")]
    public string Source { get; set; }

    public RawMovieInfo[] Movies { get; set; }
}

public class FilmsDistinctIntegrationContext : IntegrationContextBase
{
    public MoviesDistinctService MoviesDistinctService { get; set; }

    public FilmsDistinctIntegrationContext(MoviesDistinctService moviesDistinctService)
    {
        MoviesDistinctService = moviesDistinctService;
    }
}

public class FilmsDistinctIntegration : NoAskIntegrationBase<FilmsDistinctIntegrationRequestPayload, FilmsDistinctIntegrationContext>
{
    public FilmsDistinctIntegration(IChannel channel, string actionName) : base(channel, actionName)
    {
    }

    protected override async Task ProcessingAsync(IntegrationRequest request, FilmsDistinctIntegrationRequestPayload? payload,
        FilmsDistinctIntegrationContext context)
    {
        if (payload == null) 
            throw new EmptyPayloadIntegrationException(_actionName);

        await context.MoviesDistinctService.DistinctMoviesAsync(payload.Source, payload.Movies);
    }
}