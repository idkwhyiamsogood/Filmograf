namespace Filmograf.BaseLibrary.Models.IntegrationExceptions;

public abstract class IntegrationException : Exception
{
    public object Payload { get; set; }
    
    protected IntegrationException(string message) : base(message) { }
}