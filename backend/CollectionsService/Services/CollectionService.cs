using AutoMapper;
using Filmograf.BaseLibrary.DataAccess.Repositories;
using Filmograf.BaseLibrary.Models.Dto;
using Filmograf.BaseLibrary.Models.Entities;
using Filmograf.BaseLibrary.Models.HttpExceptions;
using Filmograf.BaseLibrary.Models.Repo;
using Filmograf.BaseLibrary.Util;
using Filmograf.CollectionsService.Caching;
using Filmograf.CollectionsService.Models.Dto;

namespace Filmograf.CollectionsService.Services;

public class CollectionService
{
    private readonly CollectionRepository _collectionRepository;
    private readonly CollectionsCaching _collectionsCaching;
    private readonly IMapper _mapper;

    public CollectionService(CollectionRepository collectionRepository, CollectionsCaching collectionsCaching,
        IMapper mapper)
    {
        _collectionRepository = collectionRepository;
        _collectionsCaching = collectionsCaching;
        _mapper = mapper;
    }

    private async Task<CollectionResponseDto> CreateCacheForCollectionAsync(string id)
    {
        var collection = await _collectionRepository.GetByIdAsync(id);
        if (collection == null) throw new NotFoundHttpException("CollectionNorFound");

        return _mapper.Map<CollectionResponseDto>(collection);
    }

    private void CheckPersonalAccess(CollectionRepo collection, User gettingBy)
    {
        // если запрос делает админ - далее ноль вопросов
        if (gettingBy.IsAdmin) return;
        
        // если коллекция была удалена - ливаем
        if (collection.IsDeleted) throw new NotFoundHttpException("CollectionHasBeenDeleted");
        
        // ну и базовая проверка - чел является владельцем - то все ок
        if (collection.UserId == gettingBy.Id) return;

        throw new ForbiddenHttpException("NoAccessToCollection",
            $"You has no access to collection with id={collection.Id}");
    }

    private void CheckResponseAccess(CollectionResponseDto collection, User gettingBy)
    {
        // если запрос делает админ - далее ноль вопросов
        if (gettingBy.IsAdmin) return;
        
        // если коллекция была удалена - ливаем
        if (collection.IsDeleted) throw new NotFoundHttpException("CollectionHasBeenDeleted");
        
        // ну и базовая проверка - если публик или чел является владельцем - то все ок
        if (collection.IsPublic || collection.UserId == gettingBy.Id) return;

        throw new ForbiddenHttpException("NoAccessToCollection",
            $"You has no access to collection with id={collection.Id}");
    }

    public async Task<CollectionResponseDto> GetCollectionAsync(string id, User gettingBy)
    {
        var method = async () => await CreateCacheForCollectionAsync(id);
        var collection = await _collectionsCaching.CachingAsync(id, method);

        CheckResponseAccess(collection, gettingBy);
        return collection;
    }

    private async Task<IEnumerable<CollectionResponseDto>> CreateCacheForUserAsync(Guid userId,
        PaginationQueryDto pagination)
    {
        var data = await _collectionRepository.GetByUserAsync(userId,
            pagination.Page * pagination.Count, pagination.Count);

        return _mapper.Map<CollectionResponseDto[]>(data);
    }

    public async Task<IEnumerable<CollectionResponseDto>> GetByUserAsync(User gettingBy, PaginationQueryDto pagination)
    {
        var method = async () => await CreateCacheForUserAsync(gettingBy.Id, pagination);
        return await _collectionsCaching.CachingByUserAsync(gettingBy.Id, pagination, method);
    }

    public async Task<CollectionResponseDto> CreateAsync(CreateCollectionRequestDto data, User createBy)
    {
        var newCollection = _mapper.Map<CollectionRepo>(data);
        newCollection.Id = MongoDbUtil.GenerateNewId();
        newCollection.Movies = []; // empty array of movies 
        newCollection.UserId = createBy.Id;
        
        await _collectionRepository.CreateAsync(newCollection);
        await _collectionsCaching.RemoveCachingByUserRootAsync(createBy.Id);
        
        return _mapper.Map<CollectionResponseDto>(newCollection);
    }

    public async Task EditAsync(string collectionId, CreateCollectionRequestDto data, User editBy)
    {
        // получаем колеекцию и проверяем её существование
        var exitingCollection = await _collectionRepository.GetByIdAsync(collectionId);
        if (exitingCollection == null) throw new NotFoundHttpException("CollectionNotFound");
        
        // проверяем доступ
        CheckPersonalAccess(exitingCollection, editBy);
        
        // todo: to mapping
        exitingCollection.Name = data.Name;
        exitingCollection.Tags = data.Tags;
        exitingCollection.IsPublic = data.IsPublic;
        exitingCollection.IsCommentable = data.IsCommentable;
        exitingCollection.IsCopiable = data.IsCopiable;
        
        await _collectionRepository.UpdateAsync(collectionId, exitingCollection);
        await _collectionsCaching.RemoveCachingByUserRootAsync(editBy.Id);
    }

    public async Task DeleteAsync(string collectionId, User deleteBy)
    {
        // получаем колеекцию и проверяем её существование
        var exitingCollection = await _collectionRepository.GetByIdAsync(collectionId);
        if (exitingCollection == null) throw new NotFoundHttpException("CollectionNotFound");
        
        // проверяем доступ
        CheckPersonalAccess(exitingCollection, deleteBy);
        
        await _collectionRepository.SoftDeleteAsync(collectionId);
    }

    public async Task CopyAsync(string collectionId, CopyCollectionRequestDto copyData, User copyBy)
    {
        // получаем колеекцию и проверяем её существование
        var exitingCollection = await _collectionRepository.GetByIdAsync(collectionId);
        if (exitingCollection == null) throw new NotFoundHttpException("CollectionNotFound");
        
        // проверяем доступ
        CheckPersonalAccess(exitingCollection, copyBy);
        
        var newCollection = _mapper.Map<CollectionRepo>(copyData);
        
        if (!exitingCollection.IsCopiable) 
            throw new ForbiddenHttpException("CollectionIsNotCopiable");
    }

    public async Task AddMovieToCollectionAsync(string collectionId, string movieId, User addBy)
    {
        
    }
}