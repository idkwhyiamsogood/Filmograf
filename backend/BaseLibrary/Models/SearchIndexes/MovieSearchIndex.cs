namespace Filmograf.BaseLibrary.Models.SearchIndexes;

public class MovieSearchIndex
{
    public string Id { get; set; }
    public string Name { get; set; }
    public string NameSuggest { get; set; }
    public long ViewsCount { get; set; }
    public float RateIMDb { get; set; }
    public float RateFilmograf { get; set; }
    
    public string[] GenreIds { get; set; } 
    public int Year { get; set; } 
    public int AgeLimit { get; set; }
}