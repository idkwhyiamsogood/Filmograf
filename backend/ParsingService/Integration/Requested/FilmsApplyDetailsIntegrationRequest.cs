using Filmograf.BaseLibrary.Integrations.Payload;
using Filmograf.BaseLibrary.Models.Types;

namespace Filmograf.ParsingService.Integration.Requested;

public class FilmsApplyDetailsIntegrationRequest : IntegrationRequestPayloadBase
{
    public MovieDetailsParseResult[] DetailsInfo { get; set; }
}