namespace Filmograf.BaseLibrary.Models.HttpExceptions;

public class CreatedHttpException : HttpException
{
    public CreatedHttpException(string message) : base(201, "Created", message)
    { }

    public CreatedHttpException(string code, string message) : base(201, code, message)
    { }
}