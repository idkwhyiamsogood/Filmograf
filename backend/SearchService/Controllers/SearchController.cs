using Filmograf.BaseLibrary.DataAccess.Repositories;
using Filmograf.SearchService.Models.Dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Filmograf.SearchService.Controllers;

[ApiController]
[Route("api/search")]
public class SearchController : CustomControllerBase
{
    private readonly  Services.SearchService _searchService;
    public SearchController(Services.SearchService searchService)
    {
        _searchService = searchService;
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<SearchResponseDto>> SearchAsync([FromQuery] string query)
    {
        var response = _searchService.SearchAsync(query);
        return Ok(response);
    }

    
    //todo поиск тегов
    
    
    
    //todo поиск в кеше
    
    
    
    //todo сокеты
}