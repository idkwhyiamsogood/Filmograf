using System.ComponentModel.DataAnnotations;

namespace Filmograf.BaseLibrary.Models.Repo;

public class MovieRepo : RepoBase
{
    [MaxLength(96)]
    public string Name { get; set; }
    
    public string? Description { get; set; }
    
    public string Year { get; set; }
    
    public string? ImageUrl { get; set; }
    public string? MovieLink { get; set; }
    
    public Guid[] GenreIds { get; set; }
    public Guid[] CommentIds { get; set; }
}