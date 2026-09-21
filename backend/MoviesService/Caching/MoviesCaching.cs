using Filmograf.BaseLibrary.Caching;
using Filmograf.BaseLibrary.Models.Dto;
using Filmograf.MoviesService.Models.Dto;
using StackExchange.Redis;

namespace Filmograf.MoviesService.Caching;

public class MoviesCaching : CachingProviderBase<MovieResponseDto>
{
    public MoviesCaching(IConnectionMultiplexer redis) : base(redis, "movies")
    {
    }
}