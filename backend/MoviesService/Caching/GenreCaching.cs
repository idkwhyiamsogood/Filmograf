using Filmograf.BaseLibrary.Caching;
using Filmograf.BaseLibrary.Models.Entities;
using StackExchange.Redis;

namespace Filmograf.MoviesService.Caching;

public class GenreCaching : CachingProviderBase<Genre>
{
    public GenreCaching(IConnectionMultiplexer redis) : base(redis, "genres")
    {
    }
}