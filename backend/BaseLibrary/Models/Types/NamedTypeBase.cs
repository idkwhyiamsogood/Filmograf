using System.ComponentModel.DataAnnotations;

namespace Filmograf.BaseLibrary.Models.Types;

public abstract class NamedTypeBase : TypeBase
{
    [MaxLength(128)]
    public string Name { get; set; }
}