using AutoMapper;
using Filmograf.AnalyticsService.Caching;
using Filmograf.AnalyticsService.DataAccess.Repositories;
using Filmograf.AnalyticsService.Models.Repo;
using Filmograf.AnalyticsService.Util;
using Filmograf.BaseLibrary.DataAccess.Repositories;
using Filmograf.BaseLibrary.Models.HttpExceptions;
using Filmograf.BaseLibrary.Models.Repo;

namespace Filmograf.AnalyticsService.Services;

public class CollectionClicksService
{
    private readonly CollectionsCaching _collectionsCaching;
    private readonly CollectionRepository _collectionRepository;
    private readonly CollectionsClicksAnalyticRepository _collectionsClicksRepository;
    private readonly UserCollectionsActivityDailyRepository _userCollectionsActivityRepository;
    private readonly IMapper _mapper;

    public CollectionClicksService(CollectionsCaching collectionsCaching, CollectionRepository collectionRepository,
        CollectionsClicksAnalyticRepository collectionsClicksRepository, IMapper mapper,
        UserCollectionsActivityDailyRepository userCollectionsActivityRepository)
    {
        _collectionsCaching = collectionsCaching;
        _collectionRepository = collectionRepository;
        _collectionsClicksRepository = collectionsClicksRepository;
        _userCollectionsActivityRepository = userCollectionsActivityRepository;
        _mapper = mapper;
    }

    private bool CheckNewClickAvailable(UserCollectionsActivityDailyRepo? todayActivityDaily, string collectionId, DateTime now)
    {
        if (todayActivityDaily == null || todayActivityDaily.Clicks == null) return true;

        // Ищем последний клик
        var lastClick = todayActivityDaily.Clicks
            .Where(x => x.CollectionId == collectionId)
            .OrderByDescending(x => x.Timestamp)
            .FirstOrDefault();

        if (lastClick == null) return true;

        var minInterval = LocalAppSettingsUtil.AppSettings.UserMovieClickChickInterval;

        // Проверяем, прошло ли более X секунд
        return (now - lastClick.Timestamp).TotalSeconds >= minInterval;
    }

    private CollectionCache CreateCacheForCollection(CollectionRepo movieRepo)
    {
        return _mapper.Map<CollectionCache>(movieRepo);
    }
    
    // todo: SRP, интеграция с CollectionsService
    private async Task<CollectionRepo> GetCollectionAsync(string collectionId)
    {
        var method = async () =>
        {
            var data = await _collectionRepository.GetByIdAsync(collectionId);
            if (data == null) throw new NotFoundHttpException("CollectionNotFound");

            return data;
        };

        return await _collectionsCaching.CachingAsync(collectionId, method);
    }

    public async Task HandleClickCollectionAsync(string collectionId, Guid userId)
    {
        var now = DateTime.UtcNow;
        var todayDate = DateOnly.FromDateTime(now);
        
        // получаем коллекцию
        var collection = await GetCollectionAsync(collectionId);
        var collectionCache = CreateCacheForCollection(collection);
        
        // сперва учет кликов по отдельной коллекции
        await _collectionsClicksRepository.IncrementClickAsync(collectionId, todayDate);
        
        // учет кликов для отдельного пользователя
        var todayActivityDaily = await _userCollectionsActivityRepository.GetByUserAndDateAsync(userId, todayDate);
        if (!CheckNewClickAvailable(todayActivityDaily, collectionId, now)) return;
        
        // запись персонального события
        var item = new UserCollectionClickEvent 
        { CollectionId = collectionId, Timestamp = now, CollectionCache = collectionCache };
    
        await _userCollectionsActivityRepository.AddClickAsync(userId, item);
    }
}