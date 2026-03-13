namespace Filmograf.MoviesService.Models.Dto;

public class MoviesListResponseDto
{
    public string[] Ids { get; set; }
}

public class MovieResponseDto
{
    public string? Id { get; set; }
    public string Name { get; set; }
    public string? Description { get; set; }
    
    public string Year { get; set; }
    public int AgeLimit { get; set; }
    public TimeOnly? Time { get; set; }
    
    public string? ImageUrl { get; set; }
    public string? PreviewImageUrl { get; set; }
    public string? MovieLink { get; set; }
    
    public Guid[]? GenreIds { get; set; }
    
    // string: Film, IMDb, Kinopoisk, User
    public Dictionary<string, float> Rates { get; set; }
}

public class BatchMoviesRequestDto
{
    public string[] Ids { get; set; }
}