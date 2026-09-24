using Filmograf.SearchIndexerService.Util;

namespace Filmograf.SearchIndexerService.Services.Hosted;

public class MoviesReindexBackgroundService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    
    public MoviesReindexBackgroundService(IServiceScopeFactory scopeFactory)
    {
        _scopeFactory = scopeFactory;
    }
    
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        // вытягиваем интервал из конфига
        var intervalSeconds = LocalAppSettingsUtil.AppSettings.ReindexPickedMoviesInterval;
        
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
            
            // вытягиваем сервис импорта
            var importService = scope.ServiceProvider.GetRequiredService<MoviesReindexService>();

            // запускаем сам импорт
            await importService.ReindexPickedMoviesAsync(ct);
        }
        catch (Exception ex)
        {
            // todo: логгирование
        }
    }
}