namespace Filmograf.BaseLibrary.Models.HttpExceptions;

// 20x
public class AcceptedHttpException : HttpException
{
    public AcceptedHttpException(string message) : base(202, "Accepted", message)
    { }

    public AcceptedHttpException(string code, string message) : base(202, code, message)
    { }
}