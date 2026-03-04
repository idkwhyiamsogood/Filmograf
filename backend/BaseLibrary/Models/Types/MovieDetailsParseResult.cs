namespace Filmograf.BaseLibrary.Models.Types;

public class MovieDetailsParseResult
{
    public string? Id { get; set; }
    public string? ImageUrl { get; set; }
    public string? PreviewImageUrl { get; set; }
    public string? Description { get; set; }
    public List<string> Genres { get; set; }
}