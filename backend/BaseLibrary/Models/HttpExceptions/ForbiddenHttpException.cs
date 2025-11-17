namespace Filmograf.BaseLibrary.Models.HttpExceptions;

public class ForbiddenHttpException : HttpException
{
    public ForbiddenHttpException(string message) : base(403, "Forbidden", message)
    { }

    public ForbiddenHttpException(string code, string message) : base(403, code, message)
    { }
}