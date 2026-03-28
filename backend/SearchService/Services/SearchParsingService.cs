using Filmograf.BaseLibrary.Integrations.Requested;
using Filmograf.BaseLibrary.Models.Dto;
using Filmograf.SearchService.Integration.Requested;

namespace Filmograf.SearchService.Services;

public class SearchParsingService
{
    private readonly IRabbitMqRequestedService _rabbitMqService;
    
    public SearchParsingService(IRabbitMqRequestedService rabbitMqService)
    {
        _rabbitMqService = rabbitMqService;
    }

    // todo: вот это вызывай чтобы парсить поиск
    public async Task ParseSearchAsync(string query)
    {
        var request = new ParseSearchingIntegrationRequestPayload
        {
            ParsingTaskId = Guid.NewGuid(),
            Query = query,
            ReplyProps = new []
            {
                new IntegrationReplyDto
                { ReplyQueue = "parser_to_search", ReplyAction = "apply_search_parsing" },
                
                new IntegrationReplyDto
                { ReplyQueue = "parser_to_movies", ReplyAction = "apply_search_parsing" },
            }
        };
        
        await _rabbitMqService.SendNoReplyAsync("parse_search", "search_to_parser", request);
    }
}