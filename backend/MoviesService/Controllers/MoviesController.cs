using Filmograf.BaseLibrary.Models.Dto;
using Filmograf.BaseLibrary.Models.IntegrationExceptions;
using Filmograf.BaseLibrary.Models.Types;
using Filmograf.MoviesService.Services;
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
    [Authorize]
    public async Task<ActionResult> GetTopMoviesAsync([FromQuery] PaginationQueryDto pagination)
    {
        var data = await _movieTopPicksService.GetFromChartAsync(pagination);
        return Ok(data);
    }
    
    // [HttpGet("top-filmograf")]
    // [Authorize]
    // public async Task<ActionResult> GetFilmografTopMoviesAsync()
    // {
    //     await _moviesParserService.ParseMoviesAsync();
    //     return Ok();
    // }

    // [HttpGet("test")]
    // [Authorize]
    // public async Task<ActionResult> TestAsync()
    // {
    //     await _moviesParserService.ParseTestAsync();
    //     return Ok();
    // }
}