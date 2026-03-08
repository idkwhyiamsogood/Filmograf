using System.ComponentModel.DataAnnotations;

namespace Filmograf.CommentsService.Models.Dto;

public class CommentResponseDto
{
    public string Id { get; set; }
    public DateTime CreateDate { get; set; }
    public DateTime UpdateDate { get; set; }
    public Guid UserId { get; set; }
    public string Text { get; set; }
    
    public CommentResponseDto[] Childs { get; set; }
}

public class CreateCommentRequestDto
{
    [MaxLength(1024)]
    public string Text { get; set; }
}