using Filmograf.BaseLibrary.Models.Repo;

namespace Filmograf.AnalyticsService.Models.Repo;

public class MoviesClicksAnalyticRepo : RepoBase
{
    public DateOnly TargetDate { get; set; }
    public string MovieId { get; set; }
    public int Count { get; set; }
}