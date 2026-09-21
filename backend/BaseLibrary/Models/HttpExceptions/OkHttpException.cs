namespace Filmograf.BaseLibrary.Models.HttpExceptions;

// 20x
public class OkHttpException : HttpException
{
    public OkHttpException(string message) : base(200, "Ok", message)
    { }

    public OkHttpException(string code, string message) : base(200, code, message)
    { }
}