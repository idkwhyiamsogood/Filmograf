using AutoMapper;
using Filmograf.BaseLibrary.Models.Entities;
using Filmograf.MoviesService.Models.Dto;

namespace Filmograf.MoviesService;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<CollectionTag, CollectionTagResponseDto>();
    }
}