using Filmograf.BaseLibrary.Caching;
using Filmograf.BaseLibrary.Models.Repo;
using StackExchange.Redis;

namespace Filmograf.AnalyticsService.Caching;

// todo: SRP, интеграция с MoviesService
public class MoviesCaching : CachingProviderBase<MovieRepo>
{
    public MoviesCaching(IConnectionMultiplexer redis) : base(redis, "analytics-movies")
    {
    }
}