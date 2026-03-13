using Filmograf.MoviesService.Attributes;
using Microsoft.AspNetCore.Mvc;

namespace Filmograf.MoviesService.Controllers;

[ApiController]
[Route("api/collections")]
public class CollectionsController : CustomControllerBase
{
    
    
    public CollectionsController()
    {
        
    }
    
    [HttpGet("{collectionId}")]
    [UserTypePolicy]
    
    [HttpGet("my")]
    [UserTypePolicy(Guest = false)]

    [HttpGet("top")]
    [UserTypePolicy]
    
    [HttpGet("recommended")]
    [UserTypePolicy(Guest = false)]
    
    [HttpPost]
    [UserTypePolicy(Guest = false)]
    
    [HttpPatch("{collectionId}")]
    [UserTypePolicy(Guest = false)]
    
    [HttpDelete("{collectionId}")]
    [UserTypePolicy(Guest = false)]
    
    [HttpPost("{collectionId}/copy")]
    [UserTypePolicy(Guest = false)]
    
    [HttpPut("{collectionId}/movie/{movieId}")]
    [UserTypePolicy(Guest = false)]
    
    [HttpDelete("{collectionId}/movie/{movieId}")]
    [UserTypePolicy(Guest = false)]
}