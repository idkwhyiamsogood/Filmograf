using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace Filmograf.BaseLibrary.Models.Types;

// todo: repo
public class Collection : NamedTypeBase
{
    [Required]
    public Guid UserId { get; set; }
    public User User { get; set; }
    
    [DefaultValue(false)]
    public bool IsPublic { get; set; } = false;
    
    [DefaultValue(false)]
    public bool IsCommentable { get; set; } = false;
    
    public Comment[] Comments { get; set; }
}