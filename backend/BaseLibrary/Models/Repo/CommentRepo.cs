using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace Filmograf.BaseLibrary.Models.Repo;

public enum CommentEntityType
{
    Movie = 1,
    Collection = 2
}

public class CommentRepo : RepoBase
{
    [Required]
    public string EntityId { get; set; }
    
    [Required]
    public CommentEntityType EntityType { get; set; }
    
    [Required]
    public Guid UserId { get; set; }
    
    [MaxLength(2048)]
    public string Text { get; set; }
    
    // пути
    public string? ParentId { get; set; } // null = root comment
    public int Depth { get; set; }
    public string Path { get; set; }

    [DefaultValue(false)] 
    public bool IsDeleted { get; set; } = false;
}