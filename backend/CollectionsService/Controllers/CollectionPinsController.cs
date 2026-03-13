using Filmograf.BaseLibrary.Models.Context;
using Filmograf.CollectionsService.Attributes;
using Filmograf.CollectionsService.Models.Dto;
using Filmograf.CollectionsService.Services;
using Microsoft.AspNetCore.Mvc;

namespace Filmograf.CollectionsService.Controllers;

[ApiController]
[Route("api/collections/pins")]
public class CollectionPinsController : CustomControllerBase
{
    private readonly CollectionPinService _collectionPinService;
    public CollectionPinsController(CollectionPinService collectionPinService)
    {
        _collectionPinService = collectionPinService;
    }

    [HttpGet("my")]
    [UserTypePolicy(Guest = false)]
    public async Task<ActionResult<CollectionPinsResponseDto>> GetMyPinsAsync([FromServices] AuthContext authContext)
    {
        
    }
    
    [HttpPut("{collectionId}")]
    [UserTypePolicy(Guest = false)]
    
    [HttpDelete("{collectionId}")]
    [UserTypePolicy(Guest = false)]
}