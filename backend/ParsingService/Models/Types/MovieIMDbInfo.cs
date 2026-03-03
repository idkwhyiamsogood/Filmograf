using System.ComponentModel.DataAnnotations;

namespace Filmograf.ParsingService.Models.Types;

public class MovieIMDbInfo
{
    [MaxLength(256)]
    public string Name { get; set; }
    
    public string? Description { get; set; }
    
    public string Year { get; set; }
    public int AgeLimit { get; set; }
    public TimeOnly Time { get; set; }
    
    public string? ImageUrl { get; set; }
    public string? MovieLink { get; set; }
    
    public float RateIMDb { get; set; }
}