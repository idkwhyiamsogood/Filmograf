namespace Filmograf.BaseLibrary.Models.HttpExceptions;

public class UnauthorizedHttpException : HttpException
{
    public UnauthorizedHttpException(string message) : base(401, "Unauthorized", message)
    { }

    public UnauthorizedHttpException(string code, string message) : base(401, code, message)
    { }
}