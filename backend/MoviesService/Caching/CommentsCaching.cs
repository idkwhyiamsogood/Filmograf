using Filmograf.BaseLibrary.Caching;
using Filmograf.BaseLibrary.Models.Repo;
using StackExchange.Redis;

namespace Filmograf.MoviesService.Caching;

public class CommentsCaching : CachingProviderBase<CommentRepo>
{
    public CommentsCaching(IConnectionMultiplexer redis) : base(redis, "comments")
    {
    }
}