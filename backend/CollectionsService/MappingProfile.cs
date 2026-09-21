using AutoMapper;
using Filmograf.BaseLibrary.Models.Entities;
using Filmograf.BaseLibrary.Models.Repo;
using Filmograf.CollectionsService.Models.Dto;

namespace Filmograf.CollectionsService;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<CollectionTag, CollectionTagResponseDto>();
        CreateMap<CollectionPinRepo, CollectionPinsResponseDto>();
        CreateMap<CollectionRepo, CollectionResponseDto>();
        CreateMap<CreateCollectionRequestDto, CollectionRepo>();
    }
}