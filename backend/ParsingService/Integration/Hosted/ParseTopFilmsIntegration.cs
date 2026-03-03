using Filmograf.BaseLibrary.Integrations;
using Filmograf.BaseLibrary.Integrations.Payload;
using Filmograf.ParsingService.Services;
using Filmograf.ParsingService.Services.IMDb;
using Filmograf.ParsingService.Util;
using RabbitMQ.Client;

namespace Filmograf.ParsingService.Integration.Hosted;

public class ParseTopFilmsIntegrationRequestPayload : IntegrationRequestPayloadBase
{
    
}

public class ParseTopFilmsIntegrationContext : IntegrationContextBase
{
    public MoviesParserService MoviesParserService { get; set; }

    public ParseTopFilmsIntegrationContext(MoviesParserService moviesParserService)
    {
        MoviesParserService = moviesParserService;
    }
}

public class ParseTopFilmsIntegration : NoAskIntegrationBase<ParseTopFilmsIntegrationRequestPayload, ParseTopFilmsIntegrationContext>
{
    public ParseTopFilmsIntegration(IChannel channel, string actionName) : base(channel, actionName)
    {
    }

    protected override async Task ProcessingAsync(IntegrationRequest request, ParseTopFilmsIntegrationRequestPayload? payload,
        ParseTopFilmsIntegrationContext context)
    {
        var data = await IMDbParserService.ParseMoviesFromPage(LocalAppSettingsUtil.AppSettings
            .IMDbSettings.TopChartLink);
        
        return;
    }
}