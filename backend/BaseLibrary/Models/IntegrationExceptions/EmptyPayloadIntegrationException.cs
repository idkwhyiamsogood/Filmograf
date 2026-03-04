namespace Filmograf.BaseLibrary.Models.IntegrationExceptions;

public class EmptyPayloadIntegrationException : IntegrationException
{
    public EmptyPayloadIntegrationException(string action) : 
        base($"Payload-данные для задачи ({action}) были равны null.") { }
}