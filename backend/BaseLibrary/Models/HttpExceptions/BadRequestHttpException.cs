namespace Filmograf.BaseLibrary.Models.HttpExceptions;

public class BadRequestHttpException : HttpException
{
    public BadRequestHttpException(string message) : base(400, "BadRequest", message)
    { }

    public BadRequestHttpException(string code, string message) : base(400, code, message)
    { }
}