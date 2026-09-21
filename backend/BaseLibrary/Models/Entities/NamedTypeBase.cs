using System.ComponentModel.DataAnnotations;

namespace Filmograf.BaseLibrary.Models.Entities;

public abstract class NamedTypeBase : TypeBase
{
    [MaxLength(128)]
    public string Name { get; set; }
}