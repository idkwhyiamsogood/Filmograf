namespace Filmograf.BaseLibrary.Models.HttpExceptions;

public class InternalServerErrorHttpException : HttpException
{
    public InternalServerErrorHttpException(string message) : base(500, "InternalServerError", message)
    { }

    public InternalServerErrorHttpException(string code, string message) : base(500, code, message)
    { }
}