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
    private readonly ClickEntityService _clickEntityService;
    private readonly MovieRepository _movieRepository;

    public CollectionService(CollectionRepository collectionRepository, CollectionsCaching collectionsCaching,
        IMapper mapper, ClickEntityService clickEntityService, MovieRepository movieRepository)
    {
        _collectionRepository = collectionRepository;
        _collectionsCaching = collectionsCaching;
        _mapper = mapper;
        _clickEntityService = clickEntityService;
        _movieRepository = movieRepository;
    }

    private async Task<CollectionResponseDto> CreateCacheForCollectionAsync(string id)
    {
        var collection = await _collectionRepository.GetByIdAsync(id);
        if (collection == null) throw new NotFoundHttpException("CollectionNorFound");

        var dto = _mapper.Map<CollectionResponseDto>(collection);
        
        var partMovies = await _movieRepository.GetByIdsAsync(collection.Movies.Take(3));
        dto.MoviePreviews = partMovies
            .Where(i => i.ImageUrl != null || i.PreviewImageUrl != null)
            .Select(i => (i.ImageUrl ?? i.PreviewImageUrl)!)
            .ToArray();

        return dto;
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

    private void CheckAccess(CollectionRepo collection, User gettingBy)
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

    private void CheckResponseAccess(CollectionResponseDto collection, User gettingBy)
    {
        // если запрос делает админ - далее ноль вопросов
        if (gettingBy.IsAdmin) return;
        
        // если коллекция была удалена - ливаем
        if (collection.IsDeleted) throw new NotFoundHttpException("CollectionHasBeenDeleted", 
            $"Collection with id={collection.Id} has been deleted");
        
        // ну и базовая проверка - если публик или чел является владельцем - то все ок
        if (collection.IsPublic || collection.UserId == gettingBy.Id) return;

        throw new ForbiddenHttpException("NoAccessToCollection",
            $"You has no access to collection with id={collection.Id}");
    }

    public async Task<CollectionResponseDto> GetCollectionByUserAsync(string id, User gettingBy)
    {
        var sendClickRequestTask = _clickEntityService.CheckEntityClickAsync("Collection", id, gettingBy.Id);
        var method = async () => await CreateCacheForCollectionAsync(id);
        var collection = await _collectionsCaching.CachingAsync(id, method);

        CheckResponseAccess(collection, gettingBy);
        await sendClickRequestTask;
        return collection;
    }

    public async Task<CollectionResponseDto> GetCollectionAsync(string id, bool throwIfNotFound = true)
    {
        var method = async () => await CreateCacheForCollectionAsync(id);
        var collection = await _collectionsCaching.CachingAsync(id, method);

        if (collection.IsDeleted && !throwIfNotFound) return null;

        if (collection.IsDeleted) throw new NotFoundHttpException("CollectionHasBeenDeleted", 
            $"Collection with id={collection.Id} has been deleted");
        
        return collection;
    }

    public async Task<IEnumerable<CollectionResponseDto>> ListManyAsync(string[] ids)
    {
        var result = await Task.WhenAll(
            ids.Select(async id => await GetCollectionAsync(id, false))
        );

        return result
            .Where(i => i != null);
    }

    private async Task<CollectionsBatchDto> CreateCacheForUserAsync(Guid userId,
        PaginationQueryDto pagination)
    {
        var data = await _collectionRepository.GetByUserAsync(userId,
            pagination.Page * pagination.Count, pagination.Count);

        var ids = data.Select(i => i.Id!);
        
        var response = new CollectionsBatchDto 
        { Ids = ids.ToArray() };

        return response;
    }

    public async Task<CollectionsBatchDto> GetByUserAsync(User gettingBy, PaginationQueryDto pagination)
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
        
        // удаляем кеш
        await _collectionsCaching.RemoveCachingAsync(collectionId);
        await _collectionsCaching.RemoveCachingByUserRootAsync(exitingCollection.UserId);
    }

    public async Task DeleteAsync(string collectionId, User deleteBy)
    {
        // получаем колеекцию и проверяем её существование
        var exitingCollection = await _collectionRepository.GetByIdAsync(collectionId);
        if (exitingCollection == null) throw new NotFoundHttpException("CollectionNotFound");
        
        // проверяем доступ
        CheckPersonalAccess(exitingCollection, deleteBy);
        
        await _collectionRepository.SoftDeleteAsync(collectionId);
        
        // удаляем кеш
        await _collectionsCaching.RemoveCachingAsync(collectionId);
        await _collectionsCaching.RemoveCachingByUserRootAsync(exitingCollection.UserId);
    }

    public async Task<CollectionResponseDto> CopyAsync(string collectionId, CreateCollectionRequestDto copyData, User copyBy)
    {
        // получаем колеекцию и проверяем её существование
        var exitingCollection = await _collectionRepository.GetByIdAsync(collectionId);
        if (exitingCollection == null) throw new NotFoundHttpException("CollectionNotFound");
        
        // проверяем доступ
        CheckAccess(exitingCollection, copyBy);
        
        // проверяем, можно ли копировать коллекцию
        if (!exitingCollection.IsCopiable) 
            throw new ForbiddenHttpException("CollectionIsNotCopiable");

        // копируем данные
        var newCollection = _mapper.Map<CollectionRepo>(copyData);
        newCollection.Id = MongoDbUtil.GenerateNewId();
        newCollection.Movies = exitingCollection.Movies;
        newCollection.SourceCollectionId = exitingCollection.Id;
        newCollection.UserId = copyBy.Id;
        
        // добавляем коллекцию
        var newCollectionId = await _collectionRepository.CreateAsync(newCollection);
        if (string.IsNullOrEmpty(newCollectionId)) throw new InternalServerErrorHttpException(
            "CreateNewCollectionError");
        
        // удаляем кеш пользователя
        await _collectionsCaching.RemoveCachingByUserRootAsync(exitingCollection.UserId);
        
        // сохраняем id новой коллекции в списке прод-копий исходной коллекции
        exitingCollection.ProdCollections ??= new string[] { };
        exitingCollection.ProdCollections = exitingCollection.ProdCollections.Append(newCollectionId).ToArray();
        await _collectionRepository.UpdateAsync(collectionId, exitingCollection);
        
        // возвращаем response новой коллекции
        return _mapper.Map<CollectionResponseDto>(newCollection);
    }

    public async Task AddMovieToCollectionAsync(string collectionId, string movieId, User addBy)
    {
        // получаем колеекцию и проверяем её существование
        var collection = await _collectionRepository.GetByIdAsync(collectionId);
        if (collection == null) throw new NotFoundHttpException("CollectionNotFound");
        
        // проверяем доступ
        CheckPersonalAccess(collection, addBy);
        
        // проверяем, не содержит ли коллекция уже этот фильм
        var containsMovie = collection.Movies.Any(i => i == movieId);
        if (containsMovie) throw new BadRequestHttpException("CollectionAlreadyContainsMovie");

        // добавляем фильм
        collection.Movies = collection.Movies.Append(movieId).ToArray();
        
        // сохраняем
        await _collectionRepository.UpdateAsync(collectionId, collection);
        
        // удаляем кеш
        await _collectionsCaching.RemoveCachingAsync(collectionId);
        await _collectionsCaching.RemoveCachingByUserRootAsync(collection.UserId);
    }

    public async Task RemoveMovieFromCollectionAsync(string collectionId, string movieId, User addBy)
    {
        // получаем колеекцию и проверяем её существование
        var collection = await _collectionRepository.GetByIdAsync(collectionId);
        if (collection == null) throw new NotFoundHttpException("CollectionNotFound");
        
        // проверяем доступ
        CheckPersonalAccess(collection, addBy);
        
        // проверяем, не содержит ли коллекция уже этот фильм
        var containsMovie = collection.Movies.Any(i => i == movieId);
        if (!containsMovie) throw new BadRequestHttpException("CollectionNotContainsMovie");

        // удаляем фильм
        collection.Movies = collection.Movies.DeleteItem(movieId).ToArray();
        
        // сохраняем
        await _collectionRepository.UpdateAsync(collectionId, collection);
        
        // удаляем кеш
        await _collectionsCaching.RemoveCachingAsync(collectionId);
        await _collectionsCaching.RemoveCachingByUserRootAsync(collection.UserId);
    }
}