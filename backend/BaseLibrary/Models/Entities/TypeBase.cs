using System.ComponentModel.DataAnnotations;

namespace Filmograf.BaseLibrary.Models.Entities;

public abstract class TypeBase
{
    [Key]
    public Guid Id { get; set; }

    public DateTime CreateDate { get; set; } = DateTime.UtcNow;

    public DateTime UpdateDate { get; set; } = DateTime.UtcNow;
}