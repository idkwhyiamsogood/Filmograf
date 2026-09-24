namespace Filmograf.BaseLibrary.Models.Repo;

public class CollectionClicksAnalyticRepo : RepoBase
{
    public DateOnly TargetDate { get; set; }
    public string CollectionId { get; set; }
    public int Count { get; set; }
}