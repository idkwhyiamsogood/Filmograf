namespace Filmograf.AnalyticsService.Services;

public class ClicksService
{
    private readonly MovieClicksService _movieClicksService;

    public ClicksService(MovieClicksService movieClicksService)
    {
        _movieClicksService = movieClicksService;
    }

    public async Task HandleClickAsync()
    {
        
    }
}