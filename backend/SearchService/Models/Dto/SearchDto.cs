namespace Filmograf.SearchService.Models.Dto;

public enum SearchPartType
{
    Movie, Collection, Tag, Genre
}

public class SearchPartResponseDto // вот это будут контроллеры возвращать
{
    public string [] EntityIds { get; set; } //айдишники найденных сущностей
    public SearchPartType Type { get; set; }
    
}
