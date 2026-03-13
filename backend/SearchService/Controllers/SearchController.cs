using Filmograf.BaseLibrary.DataAccess.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Filmograf.SearchService.Controllers;

[ApiController]
[Route("api/search")]
public class SearchController : CustomControllerBase
{
    
    private readonly MovieRepository _movieRepository;
    
    public SearchController(MovieRepository movieRepository)
    {
        _movieRepository = movieRepository;
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult> SearchAsync([FromQuery] string query)
    {
        var data = await _movieRepository.GetByNameAsync(query);
        
        var sortedData = data
            .Select(m => new
            {
                Movie = m,
                Index = m.Name.IndexOf(query, StringComparison.OrdinalIgnoreCase)
            })
            .Where(x => x.Index >= 0) // Оставляем только те, где запрос найден
            .OrderBy(x => x.Index) // Сначала те, у которых запрос раньше
            .ThenBy(x => x.Movie.Name.Length) // При равной позиции - более короткие названия
            .Select(x => x.Movie)
            .ToList();
    
        return Ok(sortedData);
    }
}