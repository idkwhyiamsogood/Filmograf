using Filmograf.BaseLibrary.Integrations.Requested;
using Filmograf.BaseLibrary.Models.Dto;
using Filmograf.ParsingService.Integration.Hosted;
using Filmograf.ParsingService.Services.Kinogo;

namespace Filmograf.ParsingService.Services;

public class SearchService
{
    private readonly KinogoSearchService _kinogoSearchService;
    private readonly IRabbitMqRequestedService _rabbitMqService;
    
    public SearchService(KinogoSearchService kinogoSearchService, IRabbitMqRequestedService rabbitMqService)
    {
        _kinogoSearchService = kinogoSearchService;
        _rabbitMqService = rabbitMqService;
    }

    public async Task HandleSearchAsync(string targetRoomId, string query, IntegrationReplyDto[] replies)
    {
        var parsingResult = await _kinogoSearchService.SearchMoviesAsync(query);

        foreach (var reply in replies)
        {
            var completeRequest = new ParseSearchingIntegrationResultPayload
            { MovieInfos = parsingResult.ToArray(), TargetRoomId = targetRoomId };
            
            await _rabbitMqService.SendNoReplyAsync(reply.ReplyAction, reply.ReplyQueue, completeRequest);
        }
    }
}