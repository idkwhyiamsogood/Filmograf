using Filmograf.BaseLibrary.DataAccess.Repositories;
using Filmograf.BaseLibrary.Models.Dto;
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
    public async Task<ActionResult<SearchPartResponseDto>> SearchFilmAsync([FromQuery] string query, [FromQuery] PaginationQueryDto pagination,
        [FromQuery] string? roomId, [FromBody] MovieSearchRequestDto? data)
    {
        var response = await _searchService.SearchFilmAsync(query, pagination, roomId,data);
        return Ok(response);
    }
    
    [HttpPost("collections")]
    [Authorize]
    public async Task<ActionResult<SearchPartResponseDto>> SearchCollectionAsync([FromQuery] string query, [FromQuery] PaginationQueryDto pagination,
        [FromQuery] string? roomId, [FromBody] CollectionSearchRequestDto data)
    {
        var response = await _searchService.SearchCollectionAsync(query, pagination, roomId, data);
        return Ok(response);
    }
    
    [HttpGet("tags")]
    [Authorize]
    public async Task<ActionResult<SearchPartResponseDto>> SearchTagsAsync([FromQuery] string query, [FromQuery] PaginationQueryDto pagination,
        [FromQuery] string? roomId)
    {
        var response = await _searchService.SearchTagAsync(query, pagination, roomId);
        return Ok(response);
    }
    
    [HttpGet("genres")]
    [Authorize]
    public async Task<ActionResult<SearchPartResponseDto>> SearchGenresAsync([FromQuery] string query, [FromQuery] PaginationQueryDto pagination)
    {
        var response = await _searchService.SearchGenreAsync(query, pagination);
        return Ok(response);
    }
    
}