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
    private readonly  Services.SearchMovieService _searchMovieService;
    private readonly  Services.SearchCollectionService _searchCollectionService;
    private readonly  Services.SearchTagService _searchTagService;
    private readonly  Services.SearchGenreService _searchGenreService;
    public SearchController(Services.SearchMovieService searchMovieService, Services.SearchCollectionService searchCollectionService, 
        Services.SearchTagService searchTagService,Services.SearchGenreService searchGenreService)
    {
        _searchMovieService = searchMovieService;
        _searchCollectionService = searchCollectionService;
        _searchTagService = searchTagService;
        _searchGenreService = searchGenreService;
    }

    [HttpPost("movies")]
    [Authorize]
    public async Task<ActionResult<SearchPartResponseDto>> SearchFilmAsync([FromQuery] string? query, [FromQuery] PaginationQueryDto pagination,
        [FromQuery] string? roomId, [FromBody] MovieSearchRequestDto? data)
    {
        var response = await _searchMovieService.SearchFilmAsync(query ?? "", pagination, roomId, data);
        return Ok(response);
    }
    
    [HttpPost("collections")]
    [Authorize]
    public async Task<ActionResult<SearchPartResponseDto>> SearchCollectionAsync([FromQuery] string? query, [FromQuery] PaginationQueryDto pagination,
        [FromQuery] string? roomId, [FromBody] CollectionSearchRequestDto data)
    {
        var response = await _searchCollectionService.SearchCollectionAsync(query ?? "", pagination, roomId, data);
        return Ok(response);
    }
    
    [HttpGet("tags")]
    [Authorize]
    public async Task<ActionResult<SearchPartResponseDto>> SearchTagsAsync([FromQuery] string query, [FromQuery] PaginationQueryDto pagination,
        [FromQuery] string? roomId)
    {
        var response = await _searchTagService.SearchTagAsync(query, pagination, roomId);
        return Ok(response);
    }
    
    [HttpGet("genres")]
    [Authorize]
    public async Task<ActionResult<SearchPartResponseDto>> SearchGenresAsync([FromQuery] string query, [FromQuery] PaginationQueryDto pagination)
    {
        var response = await _searchGenreService.SearchGenreAsync(query, pagination);
        return Ok(response);
    }
    
}