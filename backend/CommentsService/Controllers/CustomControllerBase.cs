using Filmograf.BaseLibrary.Models.HttpExceptions;
using Microsoft.AspNetCore.Mvc;

namespace Filmograf.CommentsService.Controllers;

public class CustomControllerBase : ControllerBase
{
    protected ActionResult CustomForbidden(string message, string code)
    {
        var response = new
            { Message = message, Code = code };

        return StatusCode(403, response);
    }

    protected ActionResult CustomInternalErrorRequest(string message, string code)
    {
        var response = new
            { Message = message, Code = code };

        return StatusCode(500, response);
    }

    protected ActionResult CustomNotFound(string message, string code)
    {
        var response = new
            { Message = message, Code = code };

        return StatusCode(404, response);
    }

    protected ActionResult CustomBadRequest(string message, string code)
    {
        var response = new
            { Message = message, Code = code };

        return StatusCode(400, response);
    }

    protected string? GetJwt()
    {
        return HttpContext.Request.Headers["Authorization"]
            .FirstOrDefault()?.Split(" ").Last();
    }

    protected ActionResult ProcessingHttpException(HttpException htex)
    {
        var response = new
            { Message = htex.Message, Code = htex.Code, Data = htex.PayloadData };

        return StatusCode(htex.StatusCode, response);
    }
}