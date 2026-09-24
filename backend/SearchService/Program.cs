using Filmograf.BaseLibrary.Util;
using Filmograf.SearchService.Extensions;
using Filmograf.SearchService.Hubs;
using Filmograf.SearchService.Services.Middlewares;

namespace Filmograf.SearchService;

public class Program
{
    public async static Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        AppSettingsUtil.LoadAppSettingsData(); // todo: refactor
        //LocalAppSettingsUtil.LoadAppSettingsData();
        
        // Add services to the container.
        builder.Services.AddControllers();
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();
        builder.Services.AddSignalR();
        
        // Setting up services Pipeline.
        builder.Services
            .AddAutoMapper(_ => { }, typeof(Program).Assembly)
            .AddSwaggerConfig()
            .AddCorsConfig()
            .AddRedis()
            .AddMongoDB()
            .AddRabbitMQ()
            .AddComponents()
            .AddElastic()
            .AddAuthenticationConfig();
        
        var app = builder.Build();

        app.MapHub<SearchHub>("/search-hub");
            
        // ловушка для ошибок
        app.UseMiddleware<ExceptionHandlingMiddleware>();

        // Configure the HTTP request pipeline.
        if (AppSettingsUtil.AppSettings.DevMode)
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseCors("AllowFrontend"); // todo: в проде поменять
        app.UseAuthentication();
        app.UseAuthorization();
        
        app.MapControllers();
        app.Run();
    }
}
