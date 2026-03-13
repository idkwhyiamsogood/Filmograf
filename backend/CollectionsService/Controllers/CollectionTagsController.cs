using Filmograf.BaseLibrary.Models.Context;
using Filmograf.BaseLibrary.Models.Dto;
using Filmograf.BaseLibrary.Models.Entities;
using Filmograf.MoviesService.Attributes;
using Filmograf.MoviesService.Models.Dto;
using Filmograf.MoviesService.Services.Tags;
using Microsoft.AspNetCore.Mvc;

namespace Filmograf.MoviesService.Controllers;

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

    [HttpPost]
    [UserTypePolicy(Guest = false)]
    public async Task<ActionResult> CreateTagAsync([FromBody] CreateCollectionTagRequestDto data, 
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