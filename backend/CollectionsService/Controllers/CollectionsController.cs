using Filmograf.CollectionsService.Attributes;
using Filmograf.CollectionsService.Models.Dto;
using Microsoft.AspNetCore.Mvc;

namespace Filmograf.CollectionsService.Controllers;

[ApiController]
[Route("api/collections")]
public class CollectionsController : CustomControllerBase
{
    public CollectionsController()
    {
    }

    [HttpGet("{collectionId}")]
    [UserTypePolicy]
    public async Task<ActionResult<CollectionResponseDto>> GetCollectionAsync()
    {
        return Ok("Don't implemented yet.");
    }

    [HttpGet("my")]
    [UserTypePolicy(Guest = false)]
    public async Task<ActionResult<CollectionListResponseDto>> GetMyCollectionsAsync()
    {
        return Ok("Don't implemented yet.");
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