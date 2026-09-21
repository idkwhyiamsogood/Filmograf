namespace Filmograf.AnalyticsService.Models.Types;

public class ClickEntityEvent
{
    public DateTime Date { get; set; } = DateTime.UtcNow;
}