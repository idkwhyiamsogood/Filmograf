using AutoMapper;
using Filmograf.BaseLibrary.DataAccess.Repositories;
using Filmograf.BaseLibrary.Models.HttpExceptions;
using Filmograf.BaseLibrary.Models.Repo;
using Filmograf.BaseLibrary.Util;
using Filmograf.CollectionsService.Caching;
using Filmograf.CollectionsService.Models.Dto;

namespace Filmograf.CollectionsService.Services;

public class CollectionPinService
{
    private readonly CollectionPinRepository _collectionPinRepository;
    private readonly CollectionPinsCaching _collectionPinsCaching;
    private readonly IMapper _mapper;

    public CollectionPinService(CollectionPinRepository collectionPinRepository,
        CollectionPinsCaching collectionPinsCaching, IMapper mapper)
    {
        _collectionPinRepository = collectionPinRepository;
        _collectionPinsCaching = collectionPinsCaching;
        _mapper = mapper;
    }

    private async Task<CollectionPinsResponseDto> CreateCacheForUserAsync(Guid userId)
    {
        var data = await _collectionPinRepository.GetByUserAsync(userId);
        if (data == null) throw new NotFoundHttpException("CollectionPinsForUserNoFound",
            $"There is no collection pins for user with id={userId.ToString()}");

        return _mapper.Map<CollectionPinsResponseDto>(data);
    }

    private async Task<CollectionPinRepo> CreateEmptyPinRepoAsync(Guid userId)
    {
        var emptyRepo = new CollectionPinRepo
        {
            Id = MongoDbUtil.GenerateNewId(),
            UserId = userId,
            CollectionIds = new string[] { }
        };

        await _collectionPinRepository.CreateAsync(emptyRepo);

        return emptyRepo;
    }

    // todo: меня кумарит жестка, пока так насрал
    public async Task<CollectionPinsResponseDto> GetUserPinsAsync(Guid userId)
    {
        try
        {
            var method = async () => await CreateCacheForUserAsync(userId);
            return await _collectionPinsCaching.CachingByUserAsync(userId, method);
        }
        catch (NotFoundHttpException nfex)
        {
            var emptyRepo = await CreateEmptyPinRepoAsync(userId);
            return _mapper.Map<CollectionPinsResponseDto>(emptyRepo);
        }
    }

    public async Task<CollectionPinsResponseDto> PinCollectionAsync(Guid userId, string collectionId)
    {
        // получаем пины пользователя
        var userPins = await _collectionPinRepository.GetByUserAsync(userId);
        
        // если null - создадим пустой
        userPins ??= await CreateEmptyPinRepoAsync(userId);

        // если у чела уже есть эта подборка в пинах
        if (userPins.CollectionIds.Contains(collectionId)) throw new BadRequestHttpException("PinsAlreadyContainsMovie",
            $"There is already contains movie in pinned with id={collectionId}");

        // добавляем
        userPins.CollectionIds = userPins.CollectionIds.Append(collectionId).ToArray();

        // обновляем
        await _collectionPinRepository.UpdateAsync(userPins.Id, userPins);

        // удаляем кеш
        await _collectionPinsCaching.RemoveCachingByUserAsync(userId);
        
        // возвращаем
        return _mapper.Map<CollectionPinsResponseDto>(userPins);
    }

    public async Task<CollectionPinsResponseDto> DeletePinCollectionAsync(Guid userId, string collectionId)
    {
        // получаем пины пользователя
        var userPins = await _collectionPinRepository.GetByUserAsync(userId)
            ?? throw new BadRequestHttpException("PinsNotContainsMovie", "Фильма with id={movieId} нема"); // меня кумарит
        
        // если у чела уже есть эта подборка в пинах
        if (!userPins.CollectionIds.Contains(collectionId)) throw new BadRequestHttpException("PinsNotContainsMovie", 
            "Фильма with id={movieId} нема");

        // удаляем
        userPins.CollectionIds = userPins.CollectionIds.DeleteItem(collectionId).ToArray();

        // обновляем
        await _collectionPinRepository.UpdateAsync(userPins.Id, userPins);

        // удаляем кеш
        await _collectionPinsCaching.RemoveCachingByUserAsync(userId);
        
        // возвращаем
        return _mapper.Map<CollectionPinsResponseDto>(userPins);
    }
}