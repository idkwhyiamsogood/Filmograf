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
    [Authorize]
    public async Task<ActionResult> GetTopMoviesAsync()
    {
        await _moviesParserService.ParseMoviesAsync();
        return Ok();
    }

    [HttpGet("test")]
    [Authorize]
    public async Task<ActionResult> TestAsync()
    {
        await _moviesParserService.ParseTestAsync();
        return Ok();
    }
}