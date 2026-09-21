using AutoMapper;
using Filmograf.BaseLibrary.DataAccess.Providers;
using Filmograf.BaseLibrary.Models.Dto;
using Filmograf.BaseLibrary.Models.Entities;
using Filmograf.BaseLibrary.Models.HttpExceptions;
using Filmograf.CollectionsService.Caching;
using Filmograf.CollectionsService.Models.Dto;

namespace Filmograf.CollectionsService.Services.Tags;

public class CollectionTagService
{
    private readonly CollectionTagProvider _collectionTagProvider;
    private readonly CollectionTagsCaching _collectionTagsCaching;
    private readonly IMapper _mapper;

    public CollectionTagService(CollectionTagProvider collectionTagProvider, CollectionTagsCaching collectionTagsCaching,
        IMapper mapper)
    {
        _collectionTagProvider = collectionTagProvider;
        _collectionTagsCaching = collectionTagsCaching;
        _mapper = mapper;
    }

    private async Task<CollectionTagResponseDto> CreateCacheAsync(Guid tagId)
    {
        var data = await _collectionTagProvider.GetAsync(tagId);
        return _mapper.Map<CollectionTagResponseDto>(data);
    }

    public async Task<CollectionTagResponseDto> GetAsync(Guid tagId)
    {
        var method = async () => await CreateCacheAsync(tagId);
        return await _collectionTagsCaching.CachingAsync(tagId, method);
    }

    public async Task<IEnumerable<CollectionTagResponseDto>> ListManyAsync(Guid[] ids)
    {
        return await Task.WhenAll(
            ids.Select(async id => 
                await GetAsync(id))
        );
    }

    private async Task<IEnumerable<CollectionTagResponseDto>> CreateCacheForAllAsync(PaginationQueryDto pagination)
    {
        var data = await _collectionTagProvider.ListAllAsync(
            pagination.Page * pagination.Count, pagination.Count);

        return _mapper.Map<CollectionTagResponseDto[]>(data);
    }

    public async Task<IEnumerable<CollectionTagResponseDto>> ListAllAsync(PaginationQueryDto pagination)
    {
        var method = async () => await CreateCacheForAllAsync(pagination);
        return await _collectionTagsCaching.CachingAllAsync(pagination, method);
    }

    public async Task<CollectionTagResponseDto> CreateAsync(CreateCollectionTagRequestDto data, User createdBy)
    {
        var exitingTag = await _collectionTagProvider.GetByNameAsync(data.Name);
        if (exitingTag != null) throw new BadRequestHttpException("TagWithSomeNameAlreadyExits",
                "The collection tag with the some name already exiting.");
        
        var newCollectionTag = new CollectionTag
        {
            Name = data.Name,
            AuthorId = createdBy.Id
        };

        var collectionTag = await _collectionTagProvider.AddAsync(newCollectionTag);
        await _collectionTagsCaching.RemoveCachingByRootAsync();
        
        return _mapper.Map<CollectionTagResponseDto>(collectionTag);
    }

    public async Task EditAsync(Guid tagId, CreateCollectionTagRequestDto data)
    {
        // todo refactor
        var collectionTag = await _collectionTagProvider.UpdateAsync(tagId, data.Name);
        await _collectionTagsCaching.RemoveCachingByRootAsync();
    }

    public async Task DeleteAsync(Guid tagId)
    {
        await _collectionTagProvider.DeleteAsync(tagId);
        await _collectionTagsCaching.RemoveCachingByRootAsync();
    }
}