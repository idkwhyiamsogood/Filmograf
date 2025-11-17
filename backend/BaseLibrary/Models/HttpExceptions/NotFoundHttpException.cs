namespace Filmograf.BaseLibrary.Models.HttpExceptions;

public class NotFoundHttpException : HttpException
{
    public NotFoundHttpException(string message) : base(404, "NotFound", message)
    { }

    public NotFoundHttpException(string code, string message) : base(404, code, message)
    { }
}