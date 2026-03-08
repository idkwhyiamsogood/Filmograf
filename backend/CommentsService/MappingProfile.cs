using AutoMapper;
using Filmograf.BaseLibrary.Models.Repo;
using Filmograf.CommentsService.Models.Dto;

namespace Filmograf.CommentsService;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<CommentRepo, CommentResponseDto>();
    }
}