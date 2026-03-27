using Filmograf.BaseLibrary.Integrations.Payload;
using Filmograf.BaseLibrary.Models.Types;

namespace Filmograf.ParsingService.Integration.Requested;

public class MoviesApplyDetailsIntegrationRequest : IntegrationRequestPayloadBase
{
    public MovieDetailsParseResult[] DetailsInfo { get; set; }
}