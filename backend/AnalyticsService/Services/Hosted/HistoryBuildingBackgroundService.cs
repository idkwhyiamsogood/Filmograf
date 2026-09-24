using Filmograf.AnalyticsService.Services.HistoryBuilding;
using Filmograf.AnalyticsService.Util;

namespace Filmograf.AnalyticsService.Services.Hosted;

public class HistoryBuildingBackgroundService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    
    public HistoryBuildingBackgroundService(IServiceScopeFactory scopeFactory)
    {
        _scopeFactory = scopeFactory;
    }
    
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        // вытягиваем интервал из конфига
        var intervalSeconds = LocalAppSettingsUtil.AppSettings.HistoryReBuildingInterval;
        
        // используем PeriodicTimer, т.к. Task.Wait не учитывает время выполнения задачи
        var period = TimeSpan.FromSeconds(intervalSeconds);
        using var timer = new PeriodicTimer(period);

        try
        {
            // ждем...
            while (await timer.WaitForNextTickAsync(stoppingToken))
            {
                await DoWorkAsync(stoppingToken);
            }
        }
        catch (OperationCanceledException)
        {
            // todo: логирование...
            // _logger.LogInformation("{Time} INFO: BackgroundService импорта терминалов останавливается...", DateTime.Now);
        }
    }
    
    private async Task DoWorkAsync(CancellationToken ct)
    {
        try
        {
            // т.к. BackgroundService - это Singleton под капотом, необходимо создать Scoped контекст вручную
            using var scope = _scopeFactory.CreateScope();
            
            // вытягиваем сервис
            var importService = scope.ServiceProvider.GetRequiredService<DeferredQueueHistoryBuildingService>();

            // запускаем сам импорт
            await importService.ReBuildHistoryForAllQueueAsync(ct);
        }
        catch (Exception ex)
        {
            // todo: логгирование
        }
    }
}