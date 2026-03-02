using System.ComponentModel.DataAnnotations;

namespace Filmograf.BaseLibrary.Models.Repo;

public class CommentRepo : RepoBase
{
    [Required]
    public Guid UserId { get; set; }
    
    [MaxLength(1024)]
    public string Text { get; set; }
    
    // id-шники пользователей
    public Guid[] LikedIds { get; set; }
    public Guid[] DislikedIds { get; set; }
    
    public CommentRepo[] Comments { get; set; }
}