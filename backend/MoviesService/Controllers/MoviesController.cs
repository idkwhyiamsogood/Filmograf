using Filmograf.BaseLibrary.Models.IntegrationExceptions;
using Filmograf.BaseLibrary.Models.Types;
using Filmograf.MoviesService.Services;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Filmograf.MoviesService.Controllers;

[ApiController]
[Route("api/movies")]
public class MoviesController : CustomControllerBase
{
    private readonly MoviesParserService _moviesParserService;
    
    public MoviesController(MoviesParserService moviesParserService)
    {
        _moviesParserService = moviesParserService;
    }

    [HttpGet("top")]
    // [Authorize]
    public async Task<ActionResult<List<Movie>>> GetTopMoviesAsync()
    {
        try
        {
            return Ok(await _moviesParserService.ParseMoviesAsync("https://www.imdb.com/chart/top/"));
        }
        catch (TimeoutException ex)
        {
            return StatusCode(408, $"Request timed out: {ex.Message}");
        }
        catch (IntegrationException ex)
        {
            return BadRequest($"Integration error: {ex.Message}");
        }
        catch (Exception ex)
        {
            return BadRequest($"Error: {ex.Message}");
        }
    }
}