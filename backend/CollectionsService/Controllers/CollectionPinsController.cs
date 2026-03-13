using Filmograf.MoviesService.Attributes;
using Microsoft.AspNetCore.Mvc;

namespace Filmograf.MoviesService.Controllers;

[ApiController]
[Route("api/collections/pins")]
public class CollectionPinsController : CustomControllerBase
{
    public CollectionPinsController()
    {
        
    }
    
    [HttpGet("my")]
    [UserTypePolicy(Guest = false)]
    
    [HttpPut("{collectionId}")]
    [UserTypePolicy(Guest = false)]
}