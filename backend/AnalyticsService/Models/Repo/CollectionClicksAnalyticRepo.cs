using Filmograf.BaseLibrary.Models.Repo;

namespace Filmograf.AnalyticsService.Models.Repo;

public class CollectionClicksAnalyticRepo : RepoBase
{
    public DateOnly TargetDate { get; set; }
    public string CollectionId { get; set; }
    public int Count { get; set; }
}