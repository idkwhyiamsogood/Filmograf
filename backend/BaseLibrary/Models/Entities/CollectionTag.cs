namespace Filmograf.BaseLibrary.Models.Entities;

public class CollectionTag : NamedTypeBase
{
    public Guid? AuthorId { get; set; }
    public User? Author { get; set; }
}