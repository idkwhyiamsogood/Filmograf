namespace Filmograf.BaseLibrary.Models.Repo;

public class CommentLikeRepo : RepoBase
{
    public string CommentId { get; set; }
    
    public Guid UserId { get; set; }

    // 1 = like, -1 = dislike
    public int Value { get; set; }
}