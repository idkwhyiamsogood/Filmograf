using System.ComponentModel.DataAnnotations;

namespace Filmograf.BaseLibrary.Models.Repo;

public class CollectionPinRepo : RepoBase
{
    [Required]
    public string CollectionId { get; set; }
    
    [Required]
    public Guid UserId { get; set; }
}