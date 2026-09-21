using System.ComponentModel.DataAnnotations;

namespace Filmograf.BaseLibrary.Models.Repo;

public class CollectionPinRepo : RepoBase
{
    [Required]
    public Guid UserId { get; set; }
    
    [Required]
    public string[] CollectionIds { get; set; }
}