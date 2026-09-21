using Filmograf.BaseLibrary.Models.Entities;
using Filmograf.BaseLibrary.Models.Types;
using Newtonsoft.Json;
using StackExchange.Redis;

namespace Filmograf.BaseLibrary.DataAccess.Providers;

public class AuthProvider
{
    private readonly IConnectionMultiplexer _redis;
    private readonly IDatabase _redisDb;
    private const string AuthByIdPrefix = "auth:byId:";
    private const string AuthByJwtPrefix = "auth:byJwt:";
    private const string UserAuthsPrefix = "auth:byUser:";

    public AuthProvider(IConnectionMultiplexer redis)
    {
        _redis = redis;
        _redisDb = _redis.GetDatabase();
    }

    public virtual async Task<Auth?> AddAsync(Auth item)
    {
        item.Id = Guid.NewGuid();

        var authJson = JsonConvert.SerializeObject(item);
        var transaction = _redisDb.CreateTransaction();
        // var expired = new TimeSpan(10, 0, 0);

        // byId
        transaction.StringSetAsync($"{AuthByIdPrefix}{item.Id}", authJson);

        // byJwt
        if (!string.IsNullOrEmpty(item.Jwt))
        {
            transaction.StringSetAsync($"{AuthByJwtPrefix}{item.Jwt}", authJson);
        }

        // byUser (SET of authIds)
        transaction.SetAddAsync($"{UserAuthsPrefix}{item.UserId}", item.Id.ToString());

        await transaction.ExecuteAsync();
        return item;
    }

    public async Task<Auth?> GetAsync(Guid id)
    {
        var authJson = await _redisDb.StringGetAsync($"{AuthByIdPrefix}{id}");
        return authJson.IsNullOrEmpty 
            ? null 
            : JsonConvert.DeserializeObject<Auth>(authJson!);
    }

    public async Task<Auth?> GetByJwtAsync(string jwt)
    {
        var authJson = await _redisDb.StringGetAsync($"{AuthByJwtPrefix}{jwt}");
        return authJson.IsNullOrEmpty
            ? null
            : JsonConvert.DeserializeObject<Auth>(authJson!);
    }

    public async Task<bool> DeleteByJwtAsync(string jwt)
    {
        var authJson = await _redisDb.StringGetAsync($"{AuthByJwtPrefix}{jwt}");
        if (authJson.IsNullOrEmpty) return false;

        var auth = JsonConvert.DeserializeObject<Auth>(authJson!);
        if (auth == null) return false;

        var transaction = _redisDb.CreateTransaction();

        transaction.KeyDeleteAsync($"{AuthByJwtPrefix}{jwt}");
        transaction.KeyDeleteAsync($"{AuthByIdPrefix}{auth.Id}");
        transaction.SetRemoveAsync($"{UserAuthsPrefix}{auth.UserId}", auth.Id.ToString());

        return await transaction.ExecuteAsync();
    }

    public async Task CloseAllAnotherSessionsAsync(Guid userId)
    {
        var authIds = await _redisDb.SetMembersAsync($"{UserAuthsPrefix}{userId}");

        foreach (var authIdValue in authIds)
        {
            if (!Guid.TryParse(authIdValue!, out var authId)) continue;

            var authJson = await _redisDb.StringGetAsync($"{AuthByIdPrefix}{authId}");
            if (authJson.IsNullOrEmpty) continue;

            var auth = JsonConvert.DeserializeObject<Auth>(authJson!);
            if (auth == null) continue;

            auth.State = false;

            var updatedAuthJson = JsonConvert.SerializeObject(auth);
            var transaction = _redisDb.CreateTransaction();

            transaction.StringSetAsync($"{AuthByIdPrefix}{authId}", updatedAuthJson);

            if (!string.IsNullOrEmpty(auth.Jwt))
            {
                transaction.StringSetAsync($"{AuthByJwtPrefix}{auth.Jwt}", updatedAuthJson);
            }

            await transaction.ExecuteAsync();
        }
    }

    public async Task DeleteAllAnotherSessionsAsync(Guid userId)
    {
        var authIds = await _redisDb.SetMembersAsync($"{UserAuthsPrefix}{userId}");
        var transaction = _redisDb.CreateTransaction();

        foreach (var authIdValue in authIds)
        {
            if (!Guid.TryParse(authIdValue!, out var authId)) continue;

            var authKey = $"{AuthByIdPrefix}{authId}";

            transaction.StringGetAsync(authKey).ContinueWith(t =>
            {
                if (!t.IsCompletedSuccessfully || t.Result.IsNullOrEmpty) return;

                var auth = JsonConvert.DeserializeObject<Auth>(t.Result!);
                if (auth == null) return;

                if (!string.IsNullOrEmpty(auth.Jwt))
                {
                    transaction.KeyDeleteAsync($"{AuthByJwtPrefix}{auth.Jwt}");
                }

                transaction.KeyDeleteAsync(authKey);
            });
        }

        transaction.KeyDeleteAsync($"{UserAuthsPrefix}{userId}");
        await transaction.ExecuteAsync();
    }
}