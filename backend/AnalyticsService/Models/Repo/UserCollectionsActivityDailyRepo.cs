using Filmograf.BaseLibrary.Models.Repo;

namespace Filmograf.AnalyticsService.Models.Repo;

public class CollectionCache
{
    public string Id { get; set; }
    public string Name { get; set; }
    public Guid[] Tags { get; set; }
}

public class UserCollectionClickEvent 
{
    public string CollectionId { get; set; }
    public CollectionCache CollectionCache { get; set; }
    public DateTime Timestamp { get; set; }
}

public class UserCollectionsActivityDailyRepo : RepoBase
{
    public Guid UserId { get; set; }
    public DateOnly Date { get; set; }
    public List<UserCollectionClickEvent> Clicks { get; set; }
}