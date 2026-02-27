using System.ComponentModel.DataAnnotations;

namespace Filmograf.BaseLibrary.Models.Types;

public class Comment : TypeBase
{
    [Required]
    public Guid OwnerId { get; set; }
    public User Owner { get; set; }
    
    [MaxLength(1024)]
    public string Text { get; set; }
    
    // id-шники пользователей
    public Guid LikedIds { get; set; }
    public Guid DislikedIds { get; set; }
    
    public Comment[] Comments { get; set; }
}