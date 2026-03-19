using Filmograf.BaseLibrary.Models.HttpExceptions;

namespace Filmograf.AnalyticsService.Services;

public class ClicksService
{
    private readonly ClickIntervalValidator _clickIntervalValidator;
    private readonly MovieClicksService _movieClicksService;
    private readonly CollectionClicksService _collectionClicksService;

    private delegate Task HandleClickEntity(string entityId, Guid userId);
    private readonly Dictionary<string, HandleClickEntity> _clickHandlers;

    public ClicksService(ClickIntervalValidator clickIntervalValidator, MovieClicksService movieClicksService, 
        CollectionClicksService collectionClicksService)
    {
        _clickIntervalValidator = clickIntervalValidator;
        _movieClicksService = movieClicksService;
        _collectionClicksService = collectionClicksService;

        _clickHandlers = new Dictionary<string, HandleClickEntity>
        {
            { "Movie", _movieClicksService.HandleClickMovieAsync },
            { "Collection", _collectionClicksService.HandleClickCollectionAsync }
        };
    }

    public async Task HandleClickAsync(string entityType, string entityId, Guid userId)
    {
        var isValid = await _clickIntervalValidator.ValidateClickAsync(userId, entityType.ToLower(), entityId);
        if (!isValid) throw new BadRequestHttpException("LastClickIntervalIsNotExpired");
        
        var clickHandler = _clickHandlers[entityType];
        if (clickHandler == null) throw new BadRequestHttpException("InvalidClickHandler");

        await clickHandler(entityId, userId);
    }
}