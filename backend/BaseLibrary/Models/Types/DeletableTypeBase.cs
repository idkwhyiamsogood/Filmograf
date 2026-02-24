using System.ComponentModel;

namespace Filmograf.BaseLibrary.Models.Types;

public abstract class DeletableTypeBase : TypeBase
{
    [DefaultValue(false)]
    public bool IsDeleted { get; set; } = false;
}