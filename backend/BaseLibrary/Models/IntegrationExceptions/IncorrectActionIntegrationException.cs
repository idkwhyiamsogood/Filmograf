namespace Filmograf.BaseLibrary.Models.IntegrationExceptions;

public class IncorrectActionIntegrationException : IntegrationException
{
    public IncorrectActionIntegrationException(string source, string target) : 
        base($"Целевая задача ({source}) не совпадает с входящей задачей ({target})") { }
}