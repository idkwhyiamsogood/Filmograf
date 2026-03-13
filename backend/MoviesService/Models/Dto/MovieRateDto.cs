using System.ComponentModel.DataAnnotations;

namespace Filmograf.MoviesService.Models.Dto;

public class RateMovieRequestDto
{
    [Required]
    [Range(minimum: 1, maximum: 10)]
    public int Rate { get; set; }
}

public class MovieRateResponseDto
{
    public DateTime CreateDate { get; set; }
    public DateTime UpdateDate { get; set; }
    public string MovieId { get; set; }
    public int Rate { get; set; }
}