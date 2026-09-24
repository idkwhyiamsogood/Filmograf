using AutoMapper;
using Filmograf.BaseLibrary.Models.Repo;
using Filmograf.BaseLibrary.Models.SearchIndexes;
using Filmograf.BaseLibrary.Util;

namespace Filmograf.SearchIndexerService;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<CollectionRepo, CollectionCache>();
        
        CreateMap<MovieRepo, MovieSearchIndex>()
            .ForMember(dest => dest.NameSuggest, opt => 
                opt.MapFrom(src => src.Name))
            .ForMember(dest => dest.Year, opt => 
                opt.MapFrom(src => src.Year.ParseIntOrDefault(0)))
            .ForMember(dest => dest.GenreIds, opt => 
                opt.MapFrom(src => src.GenreIds != null 
                    ? src.GenreIds.GuidArrToStrArr() 
                    : Array.Empty<string>()));
    }
}