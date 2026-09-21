using System.Net;
using System.Text.Json;
using Filmograf.BaseLibrary.Models.HttpExceptions;
using Filmograf.BaseLibrary.Util;

namespace Filmograf.AnalyticsService.Services.Middlewares;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        bool isDev = AppSettingsUtil.AppSettings.DevMode;
        var statusCode = HttpStatusCode.InternalServerError; // 500 по умолчанию
        object resultPayload;
        
        if (exception is HttpException httpEx)
        {
            // если это кастомная ошибка (например, 401 или 403)
            statusCode = (HttpStatusCode) httpEx.StatusCode;

            resultPayload = new
            {
                StatusCode = statusCode,
                Message = httpEx.Message,
                Code = httpEx.Code,
                Data = httpEx.PayloadData
            };
        }
        else
        {
            // какая-то ошибка (баг, БД упала и т.д.)
            _logger.LogError(exception, "Unhandled exception: {Message}", exception.Message);
            
            resultPayload = new 
            {
                StatusCode = 500,
                Message = isDev ? exception.Message : "Internal Server Error",
                
                // в Dev-режиме пробрасываем детали, на проде - дропаем
                Details = isDev ? exception.StackTrace : null 
            };
        }

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)statusCode;

        var jsonOptions = new JsonSerializerOptions 
        { 
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase 
        };

        return context.Response.WriteAsync(JsonSerializer.Serialize(resultPayload, jsonOptions));
    }
}