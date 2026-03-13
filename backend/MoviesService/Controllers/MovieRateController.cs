using Filmograf.BaseLibrary.Models.Context;
using Filmograf.MoviesService.Attributes;
using Filmograf.MoviesService.Models.Dto;
using Filmograf.MoviesService.Services.MovieRates;
using Microsoft.AspNetCore.Mvc;

namespace Filmograf.MoviesService.Controllers;

[ApiController]
[Route("api/movies/rate")]
public class MovieRateController : CustomControllerBase
{
    private readonly MovieRateService _movieRateService;

    public MovieRateController(MovieRateService movieRateService)
    {
        _movieRateService = movieRateService;
    }

    [HttpGet("my")]
    [UserTypePolicy(Guest = false)]
    public async Task<ActionResult<List<MovieRateResponseDto>>> ListMyRatesAsync([FromServices] AuthContext authContext)
    {
        var result = await _movieRateService.ListByUserAsync(authContext.CurrentUser!.Id);
        return Ok(result);
    }

    [HttpPut("{movieId}")]
    [UserTypePolicy(Guest = false)]
    public async Task<ActionResult> RateMovieAsync(string movieId, [FromServices] AuthContext authContext, 
        [FromBody] RateMovieRequestDto data)
    {
        await _movieRateService.RateMovieAsync(movieId, authContext.CurrentUser!.Id, data.Rate);
        return NoContent();
    }
}