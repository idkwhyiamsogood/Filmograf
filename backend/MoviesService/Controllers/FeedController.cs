using Filmograf.MoviesService.Attributes;
using Filmograf.MoviesService.Models.Dto;
using Filmograf.MoviesService.Services;
using Microsoft.AspNetCore.Mvc;

namespace Filmograf.MoviesService.Controllers;

[ApiController]
[Route("api/movies/feed")]
public class FeedController : CustomControllerBase
{
    private readonly MoviesParserService _moviesParserService;
    private readonly MoviesChartService _moviesChartService;

    public FeedController(MoviesParserService moviesParserService, MoviesChartService moviesChartService)
    {
        _moviesParserService = moviesParserService;
        _moviesChartService = moviesChartService;
    }
    
    [Admin]
    [HttpPost("parse-source-movie")]
    public async Task<ActionResult> FeedParseMovieAsync([FromBody] FeedMoviesDto data)
    {
        await _moviesParserService.ParseMoviesAsync(data.Source, data.Url, true, false);
        return Ok();
    }
    
    [Admin]
    [HttpPost("parse-source-collection")]
    public async Task<ActionResult> FeedParseAsync([FromBody] FeedMoviesDto data)
    {
        await _moviesParserService.ParseMoviesAsync(data.Source, data.Url, true, false);
        return Ok();
    }
    
    [Admin]
    [HttpPost("compile-chart")]
    public async Task<ActionResult> CompileChartAsync()
    {
        await _moviesChartService.CompileChartAsync();
        return Ok();
    }
}