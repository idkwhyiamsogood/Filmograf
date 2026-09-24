using Filmograf.BaseLibrary.Caching;

namespace Filmograf.BaseLibrary.Services;

public class DeferredQueuePickService
{
    private readonly DeferredQueuePickCaching _deferredQueuePickCaching;
    
    public DeferredQueuePickService(DeferredQueuePickCaching deferredQueuePickCaching)
    {
        _deferredQueuePickCaching = deferredQueuePickCaching;
    }
    
    public async Task PushAsync(string queueType, string entityId)
    {
        await _deferredQueuePickCaching.SetAsync(queueType, entityId);
    }

    public async Task<List<string>> PullIdsAsync(string queueType)
    {
        return await _deferredQueuePickCaching.PullMovieIdsAsync(queueType);
    }
}