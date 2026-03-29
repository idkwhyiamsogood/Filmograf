using Filmograf.BaseLibrary.Integrations.Payload;

namespace Filmograf.MoviesService.Integration.Requested;

public class ReceiveParsingResultIntegrationRequest : IntegrationRequestPayloadBase
{
    public string TargetRoomId { get; set; }
    public string[] MovieIds { get; set; }
}