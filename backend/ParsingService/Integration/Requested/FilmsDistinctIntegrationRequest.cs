using Filmograf.BaseLibrary.Integrations.Payload;
using Filmograf.BaseLibrary.Models.Types;

namespace Filmograf.ParsingService.Integration.Requested;

public class FilmsDistinctIntegrationRequest : IntegrationRequestPayloadBase
{
    public RawMovieInfo[] Movies { get; set; }
}