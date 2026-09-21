using System.ComponentModel;

namespace Filmograf.BaseLibrary.Integrations;

public class IntegrationResponse
{
    public string RequestId { get; set; } = null!;
    public string Action { get; set; } = null!;
    public string RequestAction { get; set; } = null!;
    public string? Payload { get; set; }
    public string? ErrorMessage { get; set; }
    
    [DefaultValue(true)]
    public bool Success { get; set; } = true;
}