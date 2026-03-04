using Filmograf.BaseLibrary.Integrations;
using Filmograf.BaseLibrary.Integrations.Payload;
using Filmograf.BaseLibrary.Models.Types;
using Filmograf.MoviesService.Services;
using RabbitMQ.Client;

namespace Filmograf.MoviesService.Integration.Hosted;

public class ParseFilmsIntegrationRequestPayload : IntegrationRequestPayloadBase
{
    public RawMovieInfo[] Movies { get; set; }
}

public class ParseFilmsIntegrationContext : IntegrationContextBase
{
    public FilmsDistinctService FilmsDistinctService { get; set; }

    public ParseFilmsIntegrationContext(FilmsDistinctService filmsDistinctService)
    {
        FilmsDistinctService = filmsDistinctService;
    }
}

public class FilmsDistinctIntegration : NoAskIntegrationBase<ParseFilmsIntegrationRequestPayload, ParseFilmsIntegrationContext>
{
    public FilmsDistinctIntegration(IChannel channel, string actionName) : base(channel, actionName)
    {
    }

    protected override async Task ProcessingAsync(IntegrationRequest request, ParseFilmsIntegrationRequestPayload? payload,
        ParseFilmsIntegrationContext context)
    {
        await context.FilmsDistinctService.DistinctMoviesAsync(payload.Movies);
    }
}