using System.ComponentModel.DataAnnotations;

namespace Filmograf.BaseLibrary.Models.Entities;

public class Bookmark : NamedTypeBase
{
    [Required]
    public Guid OwnerId { get; set; }
    public User Owner { get; set; }
}