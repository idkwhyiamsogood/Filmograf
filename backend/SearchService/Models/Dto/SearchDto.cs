namespace Filmograf.SearchService.Models.Dto;

public enum SearchPartType
{
    Movie, Collection
}

public class SearchPartResponseDto
{
    public string [] EntityIds { get; set; } //айдишники найденных сущностей
    public SearchPartType Type { get; set; }
    
}

public class SearchResponseDto
{
    public SearchPartResponseDto[] Parts { get; set; }
}