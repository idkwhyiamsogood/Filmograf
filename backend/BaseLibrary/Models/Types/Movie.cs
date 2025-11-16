namespace Filmograf.BaseLibrary.Models.Types;

public class Movie
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Year { get; set; }
    public string Rating { get; set; }
    
    public string? Description { get; set; }
    public string[]? Genres { get; set; }
    public string? ImageUrl { get; set; }
    public string? MovieLink { get; set; }
}