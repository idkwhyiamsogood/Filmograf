namespace Filmograf.BaseLibrary.Models.IntegrationExceptions;

public class IntegrationException : Exception
{
    public object? Payload { get; set; }
    
    public IntegrationException(string message) : base(message) { }

    public IntegrationException(string message, object payload) : base(message)
    {
        Payload = payload;
    }
}