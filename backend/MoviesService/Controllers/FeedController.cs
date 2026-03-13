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
    [HttpPost]
    public async Task<ActionResult> FeedAsync([FromBody] FeedMoviesDto data)
    {
        await _moviesParserService.ParseMoviesAsync(data.Source, data.Url, true, false);
        return Ok();
    }
}