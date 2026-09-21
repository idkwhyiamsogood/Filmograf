namespace Filmograf.BaseLibrary.Integrations;

public class IntegrationRequest
{
    public string RequestId { get; set; } = null!;
    public string Action { get; set; } = null!;
    public string? Payload { get; set; }
}