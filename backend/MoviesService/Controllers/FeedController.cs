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
        return NoContent();
    }
    
    [Admin]
    [HttpPost("parse-source-collection")]
    public async Task<ActionResult> FeedParseAsync([FromBody] FeedMoviesDto data)
    {
        await _moviesParserService.ParseMoviesAsync(data.Source, data.Url, true, false);
        return NoContent();
    }
    
    [Admin]
    [HttpPost("compile-chart")]
    public async Task<ActionResult> CompileChartAsync()
    {
        await _moviesChartService.CompileChartAsync();
        return NoContent();
    }
    
    [Admin]
    [HttpPost("{movieId}/re-parse-one-movie")]
    public async Task<ActionResult> ReParseOneMovieAsync(string movieId)
    {
        await _moviesParserService.ParseOneMovieDetailsAsync(movieId);
        return NoContent();
    }
    
    [Admin]
    [HttpPost("nahyi-parsing-bugs")]
    public async Task<ActionResult> FixParsingBugsAsync()
    {
        var count = await _moviesParserService.FixParsingBugsAsync();
        return Ok(count);
    }
}