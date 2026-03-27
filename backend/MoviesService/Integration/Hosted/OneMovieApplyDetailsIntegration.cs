using Filmograf.BaseLibrary.Integrations;
using Filmograf.BaseLibrary.Integrations.Payload;
using Filmograf.BaseLibrary.Models.Types;
using Filmograf.MoviesService.Services;
using RabbitMQ.Client;

namespace Filmograf.MoviesService.Integration.Hosted;

public class OneMovieApplyDetailsIntegrationRequestPayload : IntegrationRequestPayloadBase
{
    public string MovieId { get; set; }
    public RawMovieInfo Info { get; set; }
}

public class OneMovieApplyDetailsIntegrationContext : IntegrationContextBase
{
    public MoviesDetailsService MoviesDetailsService { get; set; }

    public OneMovieApplyDetailsIntegrationContext(MoviesDetailsService moviesDetailsService)
    {
        MoviesDetailsService = moviesDetailsService;
    }
}

public class OneMovieApplyDetailsIntegration : NoAskIntegrationBase<OneMovieApplyDetailsIntegrationRequestPayload, 
    OneMovieApplyDetailsIntegrationContext>
{
    public OneMovieApplyDetailsIntegration(IChannel channel, string actionName) : base(channel, actionName)
    {
    }

    protected override async Task ProcessingAsync(IntegrationRequest request, OneMovieApplyDetailsIntegrationRequestPayload? payload,
        OneMovieApplyDetailsIntegrationContext context)
    {
        await context.MoviesDetailsService.ApplyOneMovieDetailsAsync(payload.MovieId, payload.Info);
    }
}