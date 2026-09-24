using Filmograf.BaseLibrary.DataAccess.Repositories;
using Filmograf.BaseLibrary.Integrations;
using Filmograf.BaseLibrary.Integrations.Payload;
using Filmograf.BaseLibrary.Services;

using RabbitMQ.Client;

namespace Filmograf.SearchIndexerService.Integration.Hosted;

public class PickMovieUpdateIntegrationRequestPayload : IntegrationRequestPayloadBase
{
    public string MovieId { get; set; }
}

public class PickMovieUpdateIntegrationContext : IntegrationContextBase
{
    public DeferredQueuePickService DeferredQueuePickService { get; set; }

    public PickMovieUpdateIntegrationContext(DeferredQueuePickService deferredQueuePickService)
    {
        DeferredQueuePickService = deferredQueuePickService;
    }
}

public class PickMovieUpdateIntegration : NoAskIntegrationBase<PickMovieUpdateIntegrationRequestPayload, PickMovieUpdateIntegrationContext>
{
    public PickMovieUpdateIntegration(IChannel channel, string actionName) : base(channel, actionName)
    {
    }

    private readonly string _deferredQueueName = "MoviePick";
    protected override Task ProcessingAsync(IntegrationRequest request, PickMovieUpdateIntegrationRequestPayload? payload,
        PickMovieUpdateIntegrationContext context)
    {
        if (payload == null) return Task.CompletedTask;
        
        var movieId = payload.MovieId;
        return context.DeferredQueuePickService.PushAsync(_deferredQueueName, movieId);
    }
}