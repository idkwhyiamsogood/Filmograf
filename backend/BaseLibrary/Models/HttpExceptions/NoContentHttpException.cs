namespace Filmograf.BaseLibrary.Models.HttpExceptions;

public class NoContentHttpException : HttpException
{
    public NoContentHttpException(string message) : base(204, "NoContent", message)
    { }

    public NoContentHttpException(string code, string message) : base(204, code, message)
    { }
}
