using Filmograf.BaseLibrary.Caching;
using Filmograf.BaseLibrary.Models.Repo;
using Filmograf.CommentsService.Models.Dto;
using StackExchange.Redis;

namespace Filmograf.CommentsService.Caching;

public class CommentsCaching : CachingProviderBase<CommentRepo>
{
    protected readonly CachingProviderAtomic<CommentResponseDto> _cachingResponseAtomic;
    protected readonly CachingProviderAtomic<CommentResponseDto> _cachingFullResponseAtomic;
    
    public CommentsCaching(IConnectionMultiplexer redis) : base(redis, "comments")
    {
        _cachingResponseAtomic = new CachingProviderAtomic<CommentResponseDto>(redis, $"comments:v2");
        _cachingFullResponseAtomic = new CachingProviderAtomic<CommentResponseDto>(redis, $"comments:v2:full");
    }
    
    public virtual async Task<CommentResponseDto> CachingResponseAsync(string id, Func<Task<CommentResponseDto>> createItem)
    {
        var key = _cachingResponseAtomic.MakeIdKey(id);
        return await _cachingResponseAtomic.GetOrCreateAsync(key, createItem, DefaultExpirationTime);
    }

    public async Task ResetCachingResponseAsync(string id, Func<Task<CommentResponseDto>> createItem)
    {
        var key = _cachingResponseAtomic.MakeIdKey(id);
        var payloadData = await createItem();
        await _cachingResponseAtomic.CreateAsync(key, payloadData, DefaultExpirationTime);
    }

    public async Task<bool> RemoveCachingResponseAsync(string id)
    {
        var key = _cachingResponseAtomic.MakeIdKey(id);
        return await _cachingResponseAtomic.RemoveAsync(key);
    }
    
    
    public virtual async Task<CommentResponseDto> CachingFullResponseAsync(string id, Func<Task<CommentResponseDto>> createItem)
    {
        var key = _cachingFullResponseAtomic.MakeIdKey(id);
        return await _cachingFullResponseAtomic.GetOrCreateAsync(key, createItem, DefaultExpirationTime);
    }

    public async Task ResetCachingFullResponseAsync(string id, Func<Task<CommentResponseDto>> createItem)
    {
        var key = _cachingFullResponseAtomic.MakeIdKey(id);
        var payloadData = await createItem();
        await _cachingFullResponseAtomic.CreateAsync(key, payloadData, DefaultExpirationTime);
    }

    public async Task<bool> RemoveCachingFullResponseAsync(string id)
    {
        var key = _cachingFullResponseAtomic.MakeIdKey(id);
        return await _cachingFullResponseAtomic.RemoveAsync(key);
    }
}