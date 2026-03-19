using AutoMapper;
using Filmograf.AnalyticsService.Models.Repo;
using Filmograf.BaseLibrary.Models.Repo;

namespace Filmograf.AnalyticsService;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<CollectionRepo, CollectionCache>();
    }
}