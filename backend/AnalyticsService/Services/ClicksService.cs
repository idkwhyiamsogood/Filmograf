using Filmograf.AnalyticsService.Services.HistoryBuilding;
using Filmograf.AnalyticsService.Services.RateCounting;
using Filmograf.AnalyticsService.Services.ViewsCounting;
using Filmograf.BaseLibrary.Models.HttpExceptions;
using Filmograf.BaseLibrary.Util;

namespace Filmograf.AnalyticsService.Services;

public class ClicksService
{
    private readonly ClickIntervalValidator _clickIntervalValidator;
    private readonly MovieClicksService _movieClicksService;
    private readonly CollectionClicksService _collectionClicksService;
    
    private readonly MovieViewsCountingService _movieViewsCountingService;
    private readonly CollectionViewsCountingService _collectionViewsCountingService;
    
    private readonly MovieRateCountingService _movieRateCountingService;
    private readonly DeferredQueueHistoryBuildingService _historyBuildingService;
    
    
    private delegate Task HandleClickEntity(string entityId, Guid userId);
    private readonly Dictionary<string, HandleClickEntity> _clickHandlers;
    
    private delegate Task HandleClicksCountEntity(string entityId);
    private readonly Dictionary<string, HandleClicksCountEntity> _clickCountingHandlers;
    
    private delegate Task HandleRateCountEntity(string entityId);
    private readonly Dictionary<string, HandleRateCountEntity> _rateCountingHandlers;
    
    

    public ClicksService(ClickIntervalValidator clickIntervalValidator, MovieClicksService movieClicksService, 
        CollectionClicksService collectionClicksService, MovieViewsCountingService movieViewsCountingService,
        CollectionViewsCountingService collectionViewsCountingService, MovieRateCountingService movieRateCountingService,
        DeferredQueueHistoryBuildingService historyBuildingService)
    {
        _clickIntervalValidator = clickIntervalValidator;
        _movieClicksService = movieClicksService;
        _collectionClicksService = collectionClicksService;
        _movieViewsCountingService = movieViewsCountingService;
        _collectionViewsCountingService = collectionViewsCountingService;
        _movieRateCountingService = movieRateCountingService;
        _historyBuildingService = historyBuildingService;

        _clickHandlers = new Dictionary<string, HandleClickEntity>
        {
            { "Movie", _movieClicksService.HandleClickMovieAsync },
            { "Collection", _collectionClicksService.HandleClickCollectionAsync }
        };
        
        _clickCountingHandlers = new Dictionary<string, HandleClicksCountEntity>
        {
            { "Movie", _movieViewsCountingService.HandleCountAsync },
            { "Collection", _collectionViewsCountingService.HandleCountAsync }
        };
        
        _rateCountingHandlers = new Dictionary<string, HandleRateCountEntity>
        {
            { "Movie", _movieRateCountingService.HandleCountRateAsync }
        };
    }

    public async Task HandleClickAsync(string entityType, string entityId, Guid userId)
    {
        var isValid = await _clickIntervalValidator.ValidateClickAsync(userId, entityType.ToLower(), entityId);
        if (!isValid) throw new BadRequestHttpException("LastClickIntervalIsNotExpired");
        
        var clickHandler = _clickHandlers.GetValueOrDefault(entityType);
        var clickCountingHandler = _clickCountingHandlers.GetValueOrDefault(entityType);
        var handlers = new object?[] { clickHandler, clickCountingHandler };
        
        if (handlers.AnyIsNull()) throw new BadRequestHttpException("InvalidHandlerType");

        var rateCountingHandler = _rateCountingHandlers.GetValueOrDefault(entityType);
        
        // вополняем клик для сущности от имени пользователя
        await clickHandler(entityId, userId);
        
        // пересчитываем оценку, если это филльм
        if (rateCountingHandler != null) await rateCountingHandler(entityId);
        
        // пересчитываем кол-во кликов
        await clickCountingHandler(entityId);
        
        // добавляем задачу на обновление истории просмотра пользователя
        await _historyBuildingService.PushBuildHistoryTask(entityType, userId);
    }
}