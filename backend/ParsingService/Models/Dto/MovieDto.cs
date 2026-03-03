using System.ComponentModel.DataAnnotations;

namespace Filmograf.ParsingService.Models.Dto;

public class MovieRate
{
    [Required]
    [RegularExpression("^(IMDb|Kinopoisk|Filmograf)$")]
    public string Type { get; set; }
    
    public float Rate { get; set; }
}

// todo
public class MovieResponseDto
{
    public string Id { get; set; }
    
    public MovieRate[] Rates { get; set; }
}