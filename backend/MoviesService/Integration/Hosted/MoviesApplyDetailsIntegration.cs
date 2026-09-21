using Filmograf.BaseLibrary.Integrations;
using Filmograf.BaseLibrary.Integrations.Payload;
using Filmograf.BaseLibrary.Models.IntegrationExceptions;
using Filmograf.BaseLibrary.Models.Types;
using Filmograf.MoviesService.Services;
using RabbitMQ.Client;

namespace Filmograf.MoviesService.Integration.Hosted;

public class MoviesApplyDetailsIntegrationRequestPayload : IntegrationRequestPayloadBase
{
    public MovieDetailsParseResult[] DetailsInfo { get; set; }
}

public class MoviesApplyDetailsIntegrationContext : IntegrationContextBase
{
    public MoviesDetailsService MoviesDetailsService { get; set; }

    public MoviesApplyDetailsIntegrationContext(MoviesDetailsService moviesDetailsService)
    {
        MoviesDetailsService = moviesDetailsService;
    }
}

public class MoviesApplyDetailsIntegration : NoAskIntegrationBase<MoviesApplyDetailsIntegrationRequestPayload, 
    MoviesApplyDetailsIntegrationContext>
{
    public MoviesApplyDetailsIntegration(IChannel channel, string actionName) : base(channel, actionName)
    {
    }

    protected override async Task ProcessingAsync(IntegrationRequest request, MoviesApplyDetailsIntegrationRequestPayload? payload,
        MoviesApplyDetailsIntegrationContext context)
    {
        if (payload == null) 
            throw new EmptyPayloadIntegrationException(_actionName);

        await context.MoviesDetailsService.ApplyDetailsAsync(payload.DetailsInfo);
    }
}