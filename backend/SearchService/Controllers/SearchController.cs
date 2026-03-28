using Filmograf.BaseLibrary.DataAccess.Repositories;
using Filmograf.SearchService.Models.Dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Filmograf.SearchService.Controllers;

[ApiController]
[Route("api/search")]
public class SearchController : CustomControllerBase
{
    private readonly  Services.SearchService _searchService;
    public SearchController(Services.SearchService searchService)
    {
        _searchService = searchService;
    }

    [HttpPost("movies")]
    [Authorize]
    public async Task<ActionResult<SearchPartResponseDto>> SearchFilmAsync([FromQuery] string query, [FromBody] MovieSearchRequestDto data)
    {
        var response = await _searchService.SearchFilmAsync(query);
        return Ok(response);
    }
    
    [HttpPost("collections")]
    [Authorize]
    public async Task<ActionResult<SearchPartResponseDto>> SearchCollectionAsync([FromQuery] string query, [FromBody] CollectionSearchRequestDto data)
    {
        var response = await _searchService.SearchCollectionAsync(query);
        return Ok(response);
    }
    
    [HttpGet("tags")]
    [Authorize]
    public async Task<ActionResult<SearchPartResponseDto>> SearchTagsAsync([FromQuery] string query)
    {
        var response = await _searchService.SearchTagAsync(query);
        return Ok(response);
    }
    
    [HttpGet("genres")]
    [Authorize]
    public async Task<ActionResult<SearchPartResponseDto>> SearchGenresAsync([FromQuery] string query)
    {
        var response = await _searchService.SearchGenreAsync(query);
        return Ok(response);
    }

    
    //todo поиск в кеше
    
    
    
    //todo сокеты
}