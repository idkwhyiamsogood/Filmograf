using System.ComponentModel;

namespace Filmograf.CollectionsService.Models.Dto;

public class CollectionsBatchDto
{
    public string[] Ids { get; set; }
}

public class CollectionResponseDto
{
    public string Id { get; set; }
    public string Name { get; set; }
    
    public string? SourceCollectionId { get; set; }
    
    public Guid UserId { get; set; }
    
    public string[] Movies { get; set; }
    public Guid[] Tags { get; set; }
    public string[] MoviePreviews { get; set; }
    
    public bool IsPublic { get; set; } = false;
    public bool IsCommentable { get; set; } = false;
    public bool IsCopiable { get; set; } = false;
    public bool IsByFilmograf { get; set; } = false;
    public bool IsDeleted { get; set; } = false;
    
    public DateTime CreateDate { get; set; }
    public DateTime UpdateDate { get; set; }
}

public class CreateCollectionRequestDto
{
    public string Name { get; set; }
    public Guid[] Tags { get; set; }
    public bool IsPublic { get; set; } = false;
    public bool IsCommentable { get; set; } = false;
    public bool IsCopiable { get; set; } = false;
}