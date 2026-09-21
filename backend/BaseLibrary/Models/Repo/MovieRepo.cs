using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace Filmograf.BaseLibrary.Models.Repo;

public class MovieRepo : RepoBase
{
    [MaxLength(256)]
    public string Name { get; set; }
    
    public string? Description { get; set; }
    
    public string Year { get; set; }
    public int AgeLimit { get; set; }
    public TimeOnly? Time { get; set; }
    
    public string? ImageUrl { get; set; }
    public string? PreviewImageUrl { get; set; }
    public string? MovieLink { get; set; }
    
    [DefaultValue(0.0f)]
    public float RateIMDb { get; set; }
    
    [DefaultValue(0.0f)]
    public float RateKinopoisk { get; set; }
    
    public Guid[]? GenreIds { get; set; }

    [DefaultValue(0)] 
    public long ViewsCount { get; set; } = 0;
    public DateTime LastViewsCheck { get; set; } = DateTime.UtcNow;
}