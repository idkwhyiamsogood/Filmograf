using System.ComponentModel.DataAnnotations;
using Filmograf.BaseLibrary.Models.Repo;
using Microsoft.AspNetCore.Mvc;

namespace Filmograf.CommentsService.Models.Dto;

public class CommentResponseDto
{
    public string Id { get; set; }
    public DateTime CreateDate { get; set; }
    public DateTime UpdateDate { get; set; }
    public Guid UserId { get; set; }
    public string Text { get; set; }
    public bool IsDeleted { get; set; }

    public Guid[] Likes { get; set; }
    public Guid[] Dislikes { get; set; }
    
    public long ChildsCount { get; set; }
    public CommentResponseDto[] Childs { get; set; }
}

public class CreateCommentRequestDto
{
    [MaxLength(1024)]
    public string Text { get; set; }
}

public class CommentReactionRequestDto
{
    [AllowedValues(1, 0, -1)]
    public int Reaction { get; set; }
}

public class CommentEntityTypeQueryDto
{
    [Required]
    [FromQuery]
    [RegularExpression("^(Movie|Collection)$")]
    public string EntityType { get; set; }

    public CommentEntityType? GetEntityType()
    {
        return EntityType switch
        {
            "Movie" => CommentEntityType.Movie,
            "Collection" => CommentEntityType.Collection,
            _ => null
        };
    }
}