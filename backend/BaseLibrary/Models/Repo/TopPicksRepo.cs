using System.ComponentModel.DataAnnotations;

namespace Filmograf.BaseLibrary.Models.Repo;

public class TopPicksRepo : RepoBase
{
    [Required]
    [RegularExpression("^(Top_IMDb|Top_Film)$")]
    public string ChartType { get; set; }
    
    [Required]
    public Dictionary<Int32, string> Chart { get; set; }
}