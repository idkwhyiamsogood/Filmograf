using Filmograf.AnalyticsService.Services.ViewsCounting;
using Filmograf.BaseLibrary.Models.HttpExceptions;

namespace Filmograf.AnalyticsService.Services;

public class ClicksService
{
    private readonly ClickIntervalValidator _clickIntervalValidator;
    private readonly MovieClicksService _movieClicksService;
    private readonly CollectionClicksService _collectionClicksService;
    private readonly MovieViewsCountingService _movieViewsCountingService;
    private readonly CollectionViewsCountingService _collectionViewsCountingService;

    private delegate Task HandleClickEntity(string entityId, Guid userId);
    private readonly Dictionary<string, HandleClickEntity> _clickHandlers;
    
    private delegate Task HandleClicksCountEntity(string entityId);
    private readonly Dictionary<string, HandleClicksCountEntity> _clickCountingHandlers;

    public ClicksService(ClickIntervalValidator clickIntervalValidator, MovieClicksService movieClicksService, 
        CollectionClicksService collectionClicksService, MovieViewsCountingService movieViewsCountingService,
        CollectionViewsCountingService collectionViewsCountingService)
    {
        _clickIntervalValidator = clickIntervalValidator;
        _movieClicksService = movieClicksService;
        _collectionClicksService = collectionClicksService;
        _movieViewsCountingService = movieViewsCountingService;
        _collectionViewsCountingService = collectionViewsCountingService;

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
    }

    public async Task HandleClickAsync(string entityType, string entityId, Guid userId)
    {
        var isValid = await _clickIntervalValidator.ValidateClickAsync(userId, entityType.ToLower(), entityId);
        if (!isValid) throw new BadRequestHttpException("LastClickIntervalIsNotExpired");
        
        var clickHandler = _clickHandlers[entityType];
        if (clickHandler == null) throw new BadRequestHttpException("InvalidClickHandler");

        var clickCountingHandler = _clickCountingHandlers[entityType];
        if (clickHandler == null) throw new BadRequestHttpException("InvalidClickCountingHandler");

        await clickHandler(entityId, userId);
        await clickCountingHandler(entityId);
    }
}