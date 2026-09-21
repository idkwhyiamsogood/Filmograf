using Filmograf.BaseLibrary.Models.Context;
using Filmograf.BaseLibrary.Models.Dto;
using Filmograf.CollectionsService.Attributes;
using Filmograf.CollectionsService.Models.Dto;
using Filmograf.CollectionsService.Services.Tags;
using Microsoft.AspNetCore.Mvc;

namespace Filmograf.CollectionsService.Controllers;

[ApiController]
[Route("api/collections/tags")]
public class CollectionTagsController : CustomControllerBase
{
    private readonly CollectionTagService _collectionTagService;
    
    public CollectionTagsController(CollectionTagService collectionTagService)
    {
        _collectionTagService = collectionTagService;
    }

    [HttpGet]
    [UserTypePolicy]
    public async Task<ActionResult<IEnumerable<CollectionTagResponseDto>>> ListAllTagsAsync(
        [FromQuery] PaginationQueryDto pagination)
    {
        var result = await _collectionTagService.ListAllAsync(pagination);
        return Ok(result);
    }

    [HttpGet("{tagId}")]
    [UserTypePolicy]
    public async Task<ActionResult<IEnumerable<CollectionTagResponseDto>>> GetTagAsync(Guid tagId)
    {
        var result = await _collectionTagService.GetAsync(tagId);
        return Ok(result);
    }
    
    [HttpPost("batch-many")]
    [UserTypePolicy(Guest = false)]
    public async Task<ActionResult<CollectionTagResponseDto>> BatchManyTagsAsync([FromBody] BatchCollectionTagsDto data)
    {
        var result = await _collectionTagService.ListManyAsync(data.Ids);
        return Ok(result);
    }

    [HttpPost]
    [UserTypePolicy(Guest = false)]
    public async Task<ActionResult<CollectionTagResponseDto>> CreateTagAsync([FromBody] CreateCollectionTagRequestDto data, 
        [FromServices] AuthContext authContext)
    {
        var result = await _collectionTagService.CreateAsync(data, authContext.CurrentUser!);
        return Ok(result);
    }

    [HttpPatch("{tagId}")]
    [Admin]
    public async Task<ActionResult> EditTagAsync(Guid tagId, [FromBody] CreateCollectionTagRequestDto data, 
        [FromServices] AuthContext authContext)
    {
        await _collectionTagService.CreateAsync(data, authContext.CurrentUser!);
        return NoContent();
    }

    [HttpDelete("{tagId}")]
    [Admin]
    public async Task<ActionResult> DeleteTagAsync(Guid tagId)
    {
        await _collectionTagService.DeleteAsync(tagId);
        return NoContent();
    }
}