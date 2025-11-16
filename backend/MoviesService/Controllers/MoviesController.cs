using Filmograf.BaseLibrary.Integrations.Payload;
using Filmograf.BaseLibrary.Models.IntegrationExceptions;
using Microsoft.AspNetCore.Mvc;
using ParsingService.Services;

namespace Filmograf.MoviesService.Controllers;

[ApiController]
[Route("api/movies")]
public class MoviesController : CustomControllerBase
{
    private readonly RabbitMQService _rabbitMqService;
    
    public MoviesController(RabbitMQService rabbitMqService)
    {
        _rabbitMqService = rabbitMqService;
    }

    [HttpGet]
    public async Task<ActionResult> GetMoviesAsync()
    {
        try
        {
            var data = await _rabbitMqService.SendRequestAsync<TestIntegrationRequestPayload, TestIntegrationResponsePayload>(
                "test", 
                new TestIntegrationRequestPayload { Value = 10 }
            );
        
            return Ok(data.Value); // data уже типизирован как TestIntegrationResponsePayload
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