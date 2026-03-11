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

    public FeedController(MoviesParserService moviesParserService)
    {
        _moviesParserService = moviesParserService;
    }
    
    [Admin]
    [HttpPost("from-imdb")]
    public async Task<ActionResult> FeedFromIMDbAsync([FromBody] FeedMoviesDto data)
    {
        await _moviesParserService.ParseMoviesAsync("IMDb", data.Url);
        return Ok();
    }
}