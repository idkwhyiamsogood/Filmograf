using Filmograf.BaseLibrary.Models.HttpExceptions;
using Filmograf.BaseLibrary.Services;

namespace Filmograf.AnalyticsService.Services.HistoryBuilding;

public class HistoryBuildingService
{
    private readonly MoviesHistoryBuildingService _moviesHistoryService;
    private readonly CollectionsHistoryBuildingService _collectionsHistoryService;
    private readonly TopPicksService _topPicksService;
    
    private delegate Task<List<string>> HandleBuildHistory(Guid userId, CancellationToken ct = default);
    private readonly Dictionary<string, HandleBuildHistory> _buildHistoryHandlers;
    
    public HistoryBuildingService(MoviesHistoryBuildingService moviesHistoryService, TopPicksService topPicksService,
        CollectionsHistoryBuildingService collectionsHistoryService)
    {
        _moviesHistoryService = moviesHistoryService;
        _topPicksService = topPicksService;
        _collectionsHistoryService = collectionsHistoryService;
        
        _buildHistoryHandlers = new Dictionary<string, HandleBuildHistory>
        {
            { "Movie", _moviesHistoryService.HandleBuildHistoryAsync },
            { "Collection", _collectionsHistoryService.HandleBuildHistoryAsync }
        };
    }
    
    public async Task HandleBuildAsync(string entityType, Guid userId, CancellationToken ct = default)
    {
        var buildHistoryHandler = _buildHistoryHandlers.GetValueOrDefault(entityType);
        if (buildHistoryHandler == null) throw new BadRequestHttpException("InvalidHandlerType");
        
        // билдим историю просмотров пользователя
        var historyPayload = await buildHistoryHandler(userId, ct);

        // обновляем топик с историен
        var topPickKey = $"History:{entityType}:{userId}";
        await _topPicksService.SetTopPickAsync(topPickKey, historyPayload, ct);
    }
}