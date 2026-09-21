using System.ComponentModel.DataAnnotations;

namespace Filmograf.BaseLibrary.Models.Repo;

public class MovieRateRepo : RepoBase
{
    [Required]
    public Guid UserId { get; set; }
    
    [Required]
    public string MovieId { get; set; }
    
    [Required]
    [Range(minimum: 1, maximum: 10)]
    public int Rate { get; set; }
}