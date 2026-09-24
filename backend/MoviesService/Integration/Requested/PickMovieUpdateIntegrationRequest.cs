using Filmograf.BaseLibrary.Integrations.Payload;

namespace Filmograf.MoviesService.Integration.Requested;

public class PickMovieUpdateIntegrationRequest : IntegrationRequestPayloadBase
{
    public string MovieId { get; set; }
}