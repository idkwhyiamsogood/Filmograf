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
        var result = await _collectionService.GetCollectionAsync(collectionId, authContext.CurrentUser!);
        return Ok(result);
    }

    [HttpGet("my")]
    [UserTypePolicy(Guest = false)]
    public async Task<ActionResult<CollectionListResponseDto>> GetMyCollectionsAsync(
        [FromQuery] PaginationQueryDto pagination, [FromServices] AuthContext authContext)
    {
        var result = async () => await _collectionService.GetByUserAsync(authContext.CurrentUser!, pagination);
        return Ok(result);
    }

    [HttpGet("top")]
    [UserTypePolicy]
    public async Task<ActionResult<CollectionListResponseDto>> GetTopCollectionsAsync()
    {
        return Ok("Don't implemented yet.");
    }
    
    [HttpGet("recommended")]
    [UserTypePolicy(Guest = false)]
    public async Task<ActionResult<CollectionListResponseDto>> GetRecommendedCollectionsAsync()
    {
        return Ok("Don't implemented yet.");
    }
    
    [HttpPost]
    [UserTypePolicy(Guest = false)]
    public async Task<ActionResult> CreateCollectionAsync()
    {
        return Ok("Don't implemented yet.");
    }
    
    [HttpPatch("{collectionId}")]
    [UserTypePolicy(Guest = false)]
    public async Task<ActionResult> EditCollectionAsync()
    {
        return Ok("Don't implemented yet.");
    }
    
    [HttpDelete("{collectionId}")]
    [UserTypePolicy(Guest = false)]
    public async Task<ActionResult> DeleteCollectionAsync()
    {
        return Ok("Don't implemented yet.");
    }
    
    [HttpPost("{collectionId}/copy")]
    [UserTypePolicy(Guest = false)]
    public async Task<ActionResult> CopyCollectionAsync()
    {
        return Ok("Don't implemented yet.");
    }
    
    [HttpPut("{collectionId}/movie/{movieId}")]
    [UserTypePolicy(Guest = false)]
    public async Task<ActionResult> AddMovieToCollectionAsync()
    {
        return Ok("Don't implemented yet.");
    }
    
    [HttpDelete("{collectionId}/movie/{movieId}")]
    [UserTypePolicy(Guest = false)]
    public async Task<ActionResult> DeleteMovieFromCollectionAsync()
    {
        return Ok("Don't implemented yet.");
    }
}