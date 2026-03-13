using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using Filmograf.BaseLibrary.Models.Entities;
using Filmograf.BaseLibrary.Models.Types;

namespace Filmograf.BaseLibrary.Models.Repo;

public class CollectionRepo : RepoBase
{
    public string? SourceCollectionId { get; set; }
    
    [MaxLength(128)]
    public string Name { get; set; }
    
    [Required]
    public Guid UserId { get; set; }
    
    public Guid[] Movies { get; set; }
    public Guid[] Tags { get; set; }
    
    [DefaultValue(false)]
    public bool IsPublic { get; set; } = false;
    
    [DefaultValue(false)]
    public bool IsCommentable { get; set; } = false;
    
    [DefaultValue(false)]
    public bool IsCopiable { get; set; } = false;
    
    [DefaultValue(false)]
    public bool IsByFilmograf { get; set; } = false;
}