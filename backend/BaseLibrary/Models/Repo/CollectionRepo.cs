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
    
    public string[] Movies { get; set; }
    public Guid[] Tags { get; set; }
    public Guid[] GenreIds { get; set; }
    public string[] ProdCollections { get; set; } = Array.Empty<string>();
    
    [DefaultValue(false)]
    public bool IsPublic { get; set; } = false;
    
    [DefaultValue(false)]
    public bool IsCommentable { get; set; } = false;
    
    [DefaultValue(false)]
    public bool IsCopiable { get; set; } = false;
    
    [DefaultValue(false)]
    public bool IsByFilmograf { get; set; } = false;
    
    [DefaultValue(false)]
    public bool IsDeleted { get; set; } = false;
    
    [DefaultValue(0)] 
    public long ViewsCount { get; set; } = 0;
    public DateTime LastViewsCheck { get; set; } = DateTime.UtcNow;
}