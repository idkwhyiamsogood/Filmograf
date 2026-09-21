using Filmograf.BaseLibrary.Models.Entities;
using Filmograf.BaseLibrary.Models.Types;
using StackExchange.Redis;

namespace Filmograf.BaseLibrary.Caching;

public class UserCaching : CachingProviderBase<User>
{
    public UserCaching(IConnectionMultiplexer redis) : base(redis, "users")
    {
    }
}