using Filmograf.BaseLibrary.Caching;
using Filmograf.BaseLibrary.Models.Repo;
using StackExchange.Redis;

namespace Filmograf.AnalyticsService.Caching;

// todo: SRP, интеграция с CollectionsService
public class CollectionsCaching : CachingProviderBase<CollectionRepo>
{
    public CollectionsCaching(IConnectionMultiplexer redis) : base(redis, "analytics-collections")
    {
    }
}