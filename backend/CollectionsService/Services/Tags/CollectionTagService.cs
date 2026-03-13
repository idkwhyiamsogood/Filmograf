using AutoMapper;
using Filmograf.BaseLibrary.DataAccess.Providers;
using Filmograf.BaseLibrary.Models.Dto;
using Filmograf.BaseLibrary.Models.Entities;
using Filmograf.MoviesService.Caching;
using Filmograf.MoviesService.Models.Dto;

namespace Filmograf.MoviesService.Services.Tags;

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

    public async Task CreateAsync(CreateCollectionTagRequestDto data, User createdBy)
    {
        var newCollectionTag = new CollectionTag
        {
            Name = data.Name,
            AuthorId = createdBy.Id
        };

        await _collectionTagProvider.AddAsync(newCollectionTag);
        await _collectionTagsCaching.RemoveCachingByRootAsync();
    }

    public async Task DeleteAsync(Guid tagId)
    {
        await _collectionTagProvider.DeleteAsync(tagId);
        await _collectionTagsCaching.RemoveCachingByRootAsync();
    }
}