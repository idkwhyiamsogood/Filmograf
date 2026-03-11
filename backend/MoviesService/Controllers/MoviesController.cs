using Filmograf.BaseLibrary.Models.Context;
using Filmograf.BaseLibrary.Models.Dto;
using Filmograf.MoviesService.Attributes;
using Filmograf.MoviesService.Models.Dto;
using Filmograf.MoviesService.Services.Movies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Filmograf.MoviesService.Controllers;

[ApiController]
[Route("api/movies")]
public class MoviesController : CustomControllerBase
{
    private readonly Services.MoviesService _moviesService;
    private readonly MovieTopPicksService _movieTopPicksService;
    
    public MoviesController(Services.MoviesService moviesService, MovieTopPicksService movieTopPicksService)
    {
        _moviesService = moviesService;
        _movieTopPicksService = movieTopPicksService;
    }

    [HttpGet("top")]
    [UserTypePolicy]
    public async Task<ActionResult<List<MovieResponseDto>>> GetTopMoviesAsync([FromQuery] PaginationQueryDto pagination)
    {
        var data = await _movieTopPicksService.GetFromChartAsync(pagination);
        return Ok(data);
    }

    [HttpGet("{id}")]
    [UserTypePolicy]
    public async Task<ActionResult<MovieResponseDto>> GetFilmAsync(string id, [FromServices] AuthContext authContext)
    {
        var data = await _moviesService.GetByUserAsync(id, authContext.CurrentUser!);
        return Ok(data);
    }

    // [HttpGet("top-filmograf")]
    // [Authorize]
    // public async Task<ActionResult> GetFilmografTopMoviesAsync()
    // {
    //     await _moviesParserService.ParseMoviesAsync();
    //     return Ok();
    // }

    
}