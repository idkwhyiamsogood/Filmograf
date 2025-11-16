using Filmograf.BaseLibrary.Integrations;
using Filmograf.BaseLibrary.Integrations.Payload;
using ParsingService.Services;
using RabbitMQ.Client;

namespace ParsingService.Integrations;

public class ParseMoviesIntegration : IntegrationBase<ParseMoviesIntegrationRequestPayload, ParseMoviesIntegrationResponsePayload>
{
    public ParseMoviesIntegration(IChannel channel, string actionName, string routingKey) : 
        base(channel, actionName, routingKey) { }

    protected override async Task<ParseMoviesIntegrationResponsePayload> ProcessingAsync(
        IntegrationRequest request, ParseMoviesIntegrationRequestPayload? payload)
    {
        var data = await MoviesParserService.ParseMoviesFromPage(payload.Url);
        
        return new ParseMoviesIntegrationResponsePayload
        { Movies = data };
    }
}