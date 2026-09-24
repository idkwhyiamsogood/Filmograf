using Filmograf.BaseLibrary.Util;
using StackExchange.Redis;

namespace Filmograf.SearchService.Extensions;

internal static class RedisExtension
{
    public static IServiceCollection AddRedis(this IServiceCollection services)
    {
        var redisSettings = AppSettingsUtil.AppSettings.RedisSettings;
        
        services.AddSingleton<IConnectionMultiplexer>(sp => 
            ConnectionMultiplexer.Connect($"{redisSettings.Host}:6379,abortConnect=false"));

        return services;
    }
}