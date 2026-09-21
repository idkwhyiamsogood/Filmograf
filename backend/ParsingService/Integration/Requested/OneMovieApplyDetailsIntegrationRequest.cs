using Filmograf.BaseLibrary.Integrations.Payload;
using Filmograf.BaseLibrary.Models.Types;

namespace Filmograf.ParsingService.Integration.Requested;

public class OneMovieApplyDetailsIntegrationRequestPayload : IntegrationRequestPayloadBase
{
    public string MovieId { get; set; }
    public RawMovieInfo Info { get; set; }
}