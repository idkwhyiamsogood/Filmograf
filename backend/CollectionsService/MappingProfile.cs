using AutoMapper;
using Filmograf.BaseLibrary.Models.Entities;
using Filmograf.CollectionsService.Models.Dto;

namespace Filmograf.CollectionsService;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<CollectionTag, CollectionTagResponseDto>();
    }
}