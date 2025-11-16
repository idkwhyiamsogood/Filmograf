using Filmograf.BaseLibrary.Integrations.Payload;
using Newtonsoft.Json;

namespace Filmograf.BaseLibrary.Integrations;

public class IntegrationRequest<PType> where PType : IntegrationRequestPayloadBase
{
    public string RequestId { get; set; } = null!;
    public string Action { get; set; } = null!;
    public string? Payload { get; set; }

    public PType? ParsePayload()
    {
        if (Payload == null) return null;
        return JsonConvert.DeserializeObject<PType>(Payload);
    }
}