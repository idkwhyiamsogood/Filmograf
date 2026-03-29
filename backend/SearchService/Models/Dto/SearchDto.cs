using System.Collections.ObjectModel;
using Filmograf.BaseLibrary.Models.Entities;

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

public class SearchBaseQueryProps
{
    public Guid[] ExcludeIds { get; set; }
    public Guid[] IncludeIds { get; set; }
}

// если мы передаем его в SearchBaseQueryProps тогда надо два разныцх обработчикат - сложнее
// если в CollectionRequestDto - легче

public class CollectionSearchRequestDto
{
    public SearchBaseQueryProps? Genres { get; set; }
    public SearchBaseQueryProps? Tags { get; set; }
    public bool StrictMatch { get; set; }
    
}

public class MovieSearchRequestDto
{
    public SearchBaseQueryProps? Genres { get; set; }
    public bool StrictMatch { get; set; }
}
