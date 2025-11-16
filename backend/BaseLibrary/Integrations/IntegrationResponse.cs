using System.ComponentModel;
using Filmograf.BaseLibrary.Integrations.Payload;
using Newtonsoft.Json;

namespace Filmograf.BaseLibrary.Integrations;

public class IntegrationResponse<PType> where PType : IntegrationResponsePayloadBase
{
    public string RequestId { get; set; } = null!;
    public string Action { get; set; } = null!;
    public string? Payload { get; set; }
    public string? ErrorMessage { get; set; }
    
    [DefaultValue(true)]
    public bool Success { get; set; } = true;
    
    public PType? ParsePayload()
    {
        if (Payload == null) return null;
        return JsonConvert.DeserializeObject<PType>(Payload);
    }
}