using Filmograf.BaseLibrary.Models.Entities;
using Filmograf.BaseLibrary.Models.Types;

namespace Filmograf.BaseLibrary.Models.Dto;

public abstract class CreateDtoBase<TBase> 
    where TBase : TypeBase
{
    public abstract TBase CreateBase();
}