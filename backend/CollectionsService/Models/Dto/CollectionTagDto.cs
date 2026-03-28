namespace Filmograf.CollectionsService.Models.Dto;

public class CollectionTagResponseDto
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public DateTime CreateDate { get; set; }
}

public class CreateCollectionTagRequestDto
{
    public string Name { get; set; }
}

public class BatchCollectionTagsDto
{
    public Guid[] Ids { get; set; }
}