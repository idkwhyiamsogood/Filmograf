using System.ComponentModel.DataAnnotations;

namespace Filmograf.MoviesService.Models.Dto;

public class FeedMoviesDto
{
    [RegularExpression("^(IMDb|Kinopoisk)$")]
    public string Source { get; set; }
    
    public string Url { get; set; }
}