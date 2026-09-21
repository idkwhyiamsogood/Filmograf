using System.ComponentModel;

namespace Filmograf.BaseLibrary.Models.Entities;

public abstract class DeletableTypeBase : TypeBase
{
    [DefaultValue(false)]
    public bool IsDeleted { get; set; } = false;
}