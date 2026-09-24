using Microsoft.AspNetCore.Mvc;

using Filmograf.BaseLibrary.Models.Dto;
using Filmograf.SearchService.Attributes;
using Filmograf.SearchService.Models.Dto;
using Filmograf.SearchService.Services;

namespace Filmograf.SearchService.Controllers;

[ApiController]
[Route("api/search")]
public class SearchController : CustomControllerBase
{
    private readonly SearchMovieService _searchMovieService;
    private readonly SearchCollectionService _searchCollectionService;
    private readonly SearchTagService _searchTagService;
    private readonly SearchGenreService _searchGenreService;
    public SearchController(SearchMovieService searchMovieService, SearchCollectionService searchCollectionService, 
        SearchTagService searchTagService,SearchGenreService searchGenreService)
    {
        _searchMovieService = searchMovieService;
        _searchCollectionService = searchCollectionService;
        _searchTagService = searchTagService;
        _searchGenreService = searchGenreService;
    }

    [HttpPost("movies")]
    [UserTypePolicy]
    public async Task<ActionResult<SearchPartResponseDto>> SearchFilmAsync([FromQuery] string? query, [FromQuery] PaginationQueryDto pagination,
        [FromQuery] string? roomId, [FromBody] MovieSearchRequestDto? data)
    {
        var response = await _searchMovieService.SearchFilmAsync(query ?? "", pagination, roomId, data);
        return Ok(response);
    }
    
    [HttpPost("collections")]
    [UserTypePolicy]
    public async Task<ActionResult<SearchPartResponseDto>> SearchCollectionAsync([FromQuery] string? query, [FromQuery] PaginationQueryDto pagination,
        [FromQuery] string? roomId, [FromBody] CollectionSearchRequestDto data)
    {
        var response = await _searchCollectionService.SearchCollectionAsync(query ?? "", pagination, roomId, data);
        return Ok(response);
    }
    
    [HttpGet("tags")]
    [UserTypePolicy]
    public async Task<ActionResult<SearchPartResponseDto>> SearchTagsAsync([FromQuery] string query, [FromQuery] PaginationQueryDto pagination,
        [FromQuery] string? roomId)
    {
        var response = await _searchTagService.SearchTagAsync(query, pagination, roomId);
        return Ok(response);
    }
    
    [HttpGet("genres")]
    [UserTypePolicy]
    public async Task<ActionResult<SearchPartResponseDto>> SearchGenresAsync([FromQuery] string query, [FromQuery] PaginationQueryDto pagination)
    {
        var response = await _searchGenreService.SearchGenreAsync(query, pagination);
        return Ok(response);
    }
}