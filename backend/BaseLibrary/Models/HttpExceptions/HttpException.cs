namespace Filmograf.BaseLibrary.Models.HttpExceptions;

public abstract class HttpException : Exception
{
    public int StatusCode { get; set; }
    public string Code { get; set; }
    public string HttpMessage { get; set; }
    public object PayloadData { get; set; }
    
    protected HttpException(int statusCode, string code, string message) : base(message)
    {
        this.StatusCode = statusCode;
        this.Code = code;
        this.HttpMessage = message;
    }
}

