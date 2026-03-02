using Filmograf.BaseLibrary.Models.Types;
using Filmograf.MoviesService.Services;
using Microsoft.AspNetCore.Mvc;

namespace Filmograf.MoviesService.Controllers;

[ApiController]
[Route("api/genres")]
public class GenresController : CustomControllerBase
{
    private readonly GenresService _genresService;
    
    public GenresController(GenresService genresService)
    {
        _genresService = genresService;
    }

    [HttpGet]
    public async Task<ActionResult<List<Genre>>> ListAllGenresAsync()
    {
        var data = await _genresService.ListAllAsync();
        return Ok(data);
    }
}