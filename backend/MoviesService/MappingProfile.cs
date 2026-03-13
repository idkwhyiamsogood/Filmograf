using AutoMapper;
using Filmograf.BaseLibrary.Models.Repo;
using Filmograf.MoviesService.Models.Dto;

namespace Filmograf.MoviesService;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<MovieRepo, MovieResponseDto>();
        CreateMap<MovieRateRepo, MovieRateResponseDto>();
    }
}