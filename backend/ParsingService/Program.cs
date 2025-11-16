using ParsingService.Services;
using ParsingService.Util;

namespace ParsingService;

public class Program
{
    public static async Task Main(string[] args)
    {
        await PlaywrightService.InstallPlaywright();
        AppSettingsUtil.LoadAppSettingsData();
        
        await using var rabbitService = new RabbitMQService();
        await rabbitService.ConnectAsync();
        
        Console.WriteLine("RabbitMQ listener started.");
        while (true) Thread.Sleep(10);
    }
}
