using Filmograf.BaseLibrary.Models.Types;

namespace Filmograf.BaseLibrary.Integrations.Payload;

public class ParseMoviesIntegrationResponsePayload : IntegrationResponsePayloadBase
{
    public List<Movie> Movies { get; set; }
}