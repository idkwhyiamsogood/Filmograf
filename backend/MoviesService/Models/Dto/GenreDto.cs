using System.ComponentModel.DataAnnotations;
using Filmograf.BaseLibrary.Models.Dto;
using Filmograf.BaseLibrary.Models.Entities;

namespace Filmograf.MoviesService.Models.Dto;

public class CreateGenreRequestDto : CreateDtoBase<Genre>
{
    [MaxLength(128)]
    public string Name { get; set; }

    public override Genre CreateBase() => new Genre
    {
        Name = Name
    };
}