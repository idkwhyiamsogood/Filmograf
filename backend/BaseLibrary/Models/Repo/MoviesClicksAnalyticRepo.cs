namespace Filmograf.BaseLibrary.Models.Repo;

public class MoviesClicksAnalyticRepo : RepoBase
{
    public DateOnly TargetDate { get; set; }
    public string MovieId { get; set; }
    public int Count { get; set; }
}