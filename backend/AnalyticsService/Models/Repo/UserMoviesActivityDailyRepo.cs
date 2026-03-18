using Filmograf.BaseLibrary.Models.Repo;

namespace Filmograf.AnalyticsService.Models.Repo;

public class MovieCache
{
    public string Id { get; set; }
    public string Name { get; set; }
    public int Year { get; set; }
    public Guid[] Genres { get; set; }
}

public class UserClickEvent 
{
    public string MovieId { get; set; }
    public MovieCache MovieCache { get; set; }
    public DateTime Timestamp { get; set; }
}

public class UserMoviesActivityDailyRepo : RepoBase
{
    public Guid UserId { get; set; }
    public DateOnly Date { get; set; }
    public List<UserClickEvent> Clicks { get; set; }
}