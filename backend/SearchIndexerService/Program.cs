using Filmograf.BaseLibrary.Util;
using Filmograf.SearchIndexerService.Extendions;
using Filmograf.SearchIndexerService.Util;

namespace Filmograf.SearchIndexerService;

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
            .AddRabbitMQ()
            .AddElastic();
        
        var host = builder.Build();
        await host.RunAsync();
    }
}
