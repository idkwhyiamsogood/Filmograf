using Filmograf.BaseLibrary.Util;
using Filmograf.AnalyticsService.Util;
using Filmograf.SearchIndexerService.Extendions;

namespace Filmograf.AnalyticsService;

public class Program
{
    public async static Task Main(string[] args)
    {
        var builder = Host.CreateApplicationBuilder(args);

        AppSettingsUtil.LoadAppSettingsData();
        LocalAppSettingsUtil.LoadAppSettingsData();

        builder.Services
            .AddAutoMapper(_ => { }, typeof(Program).Assembly)
            .AddRedis()
            .AddMongoDB()
            .AddComponents()
            .AddRabbitMQ();
        
        var host = builder.Build();
        await host.RunAsync();
    }
}
