namespace Filmograf.BaseLibrary.Models.Types;

// todo: repo
public class Movie : NamedTypeBase
{
    public string? Description { get; set; }
    
    public string Year { get; set; }
    
    public string[]? Genres { get; set; } // todo: to separate entity
    public string? ImageUrl { get; set; }
    public string? MovieLink { get; set; }
    
    public Comment[] Comments { get; set; }
}