using AutoMapper;
using Filmograf.BaseLibrary.DataAccess.Repositories;
using Filmograf.BaseLibrary.Models.Dto;
using Filmograf.BaseLibrary.Models.Entities;
using Filmograf.BaseLibrary.Models.HttpExceptions;
using Filmograf.BaseLibrary.Models.Repo;
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
    
    private void CheckAccess(CollectionRepo collection, User gettingBy)
    {
        if (gettingBy.IsAdmin || collection.IsPublic || collection.UserId == gettingBy.Id) return;

        throw new ForbiddenHttpException("NoAccessToCollection",
            $"You has no access to collection with id={collection.Id}");
    }

    private void CheckAccess(CollectionResponseDto collection, User gettingBy)
    {
        if (gettingBy.IsAdmin || collection.IsPublic || collection.UserId == gettingBy.Id) return;

        throw new ForbiddenHttpException("NoAccessToCollection",
            $"You has no access to collection with id={collection.Id}");
    }
    
    public async Task<CollectionResponseDto> GetCollectionAsync(string id, User gettingBy)
    {
        var method = async () => await CreateCacheForCollectionAsync(id);
        var collection = await _collectionsCaching.CachingAsync(id, method);

        CheckAccess(collection, gettingBy);
        return collection;
    }

    private async Task<IEnumerable<CollectionResponseDto>> CreateCacheForUserAsync(Guid userId, PaginationQueryDto pagination)
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
}