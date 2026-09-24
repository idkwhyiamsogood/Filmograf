using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using MongoDB.Bson.Serialization.Attributes;

namespace Filmograf.BaseLibrary.Models.Repo;

[BsonIgnoreExtraElements]
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

    // in-repository cache:
    [DefaultValue(0)] 
    public long ViewsCount { get; set; } = 0;
    
    [DefaultValue(-1.0f)]
    public float RateFilmograf { get; set; } = -1.0f;
}