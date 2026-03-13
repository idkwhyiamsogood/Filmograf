using AutoMapper;
using Filmograf.BaseLibrary.DataAccess.Repositories;
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

    public async Task<CollectionPinsResponseDto> GetUserPinsAsync(Guid userId)
    {
        
    }
}