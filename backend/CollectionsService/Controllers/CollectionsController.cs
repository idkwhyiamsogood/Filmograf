using Filmograf.BaseLibrary.Models.Context;
using Filmograf.BaseLibrary.Models.Dto;
using Filmograf.CollectionsService.Attributes;
using Filmograf.CollectionsService.Models.Dto;
using Filmograf.CollectionsService.Services;
using Microsoft.AspNetCore.Mvc;

namespace Filmograf.CollectionsService.Controllers;

[ApiController]
[Route("api/collections")]
public class CollectionsController : CustomControllerBase
{
    private readonly CollectionService _collectionService;
    
    public CollectionsController(CollectionService collectionService)
    {
        _collectionService = collectionService;
    }

    [HttpGet("{collectionId}")]
    [UserTypePolicy]
    public async Task<ActionResult<CollectionResponseDto>> GetCollectionAsync(string collectionId, 
        [FromServices] AuthContext authContext)
    {
        var result = await _collectionService.GetCollectionByUserAsync(collectionId, authContext.CurrentUser!);
        return Ok(result);
    }

    [HttpPost("batch-many")]
    [UserTypePolicy]
    public async Task<ActionResult<List<CollectionResponseDto>>> BatchCollectionsAsync([FromBody] CollectionsBatchDto data)
    {
        var result = await _collectionService.ListManyAsync(data.Ids);
        return Ok(result);
    }

    [HttpGet("my")]
    [UserTypePolicy(Guest = false)]
    public async Task<ActionResult<CollectionsBatchDto>> GetMyCollectionsAsync(
        [FromQuery] PaginationQueryDto pagination, [FromServices] AuthContext authContext)
    {
        var result = await _collectionService.GetByUserAsync(authContext.CurrentUser!, pagination);
        return Ok(result);
    }

    [HttpGet("top")]
    [UserTypePolicy]
    public async Task<ActionResult<CollectionsBatchDto>> GetTopCollectionsAsync()
    {
        return Ok("Don't implemented yet.");
    }
    
    [HttpGet("recommended")]
    [UserTypePolicy(Guest = false)]
    public async Task<ActionResult<CollectionsBatchDto>> GetRecommendedCollectionsAsync()
    {
        return Ok("Don't implemented yet.");
    }
    
    [HttpPost]
    [UserTypePolicy(Guest = false)]
    public async Task<ActionResult> CreateCollectionAsync([FromBody] CreateCollectionRequestDto data, 
        [FromServices] AuthContext authContext)
    {
        var result = await _collectionService.CreateAsync(data, authContext.CurrentUser!);
        return Ok(result);
    }
    
    [HttpPatch("{collectionId}")]
    [UserTypePolicy(Guest = false)]
    public async Task<ActionResult> EditCollectionAsync(string collectionId, [FromBody] CreateCollectionRequestDto data, 
        [FromServices] AuthContext authContext)
    {
        await _collectionService.EditAsync(collectionId, data, authContext.CurrentUser!);
        return NoContent();
    }
    
    [HttpDelete("{collectionId}")]
    [UserTypePolicy(Guest = false)]
    public async Task<ActionResult> DeleteCollectionAsync(string collectionId, [FromServices] AuthContext authContext)
    {
        await _collectionService.DeleteAsync(collectionId, authContext.CurrentUser!);
        return NoContent();
    }
    
    [HttpPost("{collectionId}/copy")]
    [UserTypePolicy(Guest = false)]
    public async Task<ActionResult<CollectionResponseDto>> CopyCollectionAsync(string collectionId, [FromBody] CreateCollectionRequestDto data,
        [FromServices] AuthContext authContext)
    {
        var result = await _collectionService.CopyAsync(collectionId, data, authContext.CurrentUser!);
        return Ok(result);
    }
    
    [HttpPut("{collectionId}/movie/{movieId}")]
    [UserTypePolicy(Guest = false)]
    public async Task<ActionResult> AddMovieToCollectionAsync(string collectionId, string movieId, 
        [FromServices] AuthContext authContext)
    {
        await _collectionService.AddMovieToCollectionAsync(collectionId, movieId, authContext.CurrentUser!);
        return NoContent();
    }
    
    [HttpDelete("{collectionId}/movie/{movieId}")]
    [UserTypePolicy(Guest = false)]
    public async Task<ActionResult> DeleteMovieFromCollectionAsync(string collectionId, string movieId, 
        [FromServices] AuthContext authContext)
    {
        await _collectionService.RemoveMovieFromCollectionAsync(collectionId, movieId, authContext.CurrentUser!);
        return NoContent();
    }
}