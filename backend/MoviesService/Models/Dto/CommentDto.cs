using System.ComponentModel.DataAnnotations;

namespace Filmograf.MoviesService.Models.Dto;

public class CommentPathQueryDto
{
    public string[] Parts { get; set; }
}

public class CreateCommentRequestDto
{
    [MaxLength(1024)]
    public string Text { get; set; }
}