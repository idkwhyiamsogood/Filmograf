using System.ComponentModel.DataAnnotations;

namespace Filmograf.BaseLibrary.Models.Types;

public class RawMovieInfo
{
    [RegularExpression("^(IMDb|Kinopoisk)$")]
    public string Source { get; set; }
    
    [MaxLength(256)]
    public string Name { get; set; }
    
    public string? Description { get; set; }
    
    public string Year { get; set; }
    public int AgeLimit { get; set; }
    public TimeOnly Time { get; set; }
    
    public string? ImageUrl { get; set; }
    public string? PreviewImageUrl { get; set; }
    public string? MovieLink { get; set; }
    
    public float Rate { get; set; }
    
    // служебная переменная, используется ток при парсинге чартов, чтобы получать место в рейтингах
    public int? ChartIndex { get; set; }
    
    public List<string> Genres { get; set; } = new();
}