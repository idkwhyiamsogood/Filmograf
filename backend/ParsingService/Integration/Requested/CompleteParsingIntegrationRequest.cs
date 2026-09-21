using System.ComponentModel.DataAnnotations;
using Filmograf.BaseLibrary.Integrations.Payload;
using Filmograf.BaseLibrary.Models.Types;

namespace Filmograf.ParsingService.Integration.Requested;

public class CompleteParsingIntegrationRequest : IntegrationRequestPayloadBase
{
    [RegularExpression("^(IMDb|Kinopoisk)$")]
    public string Source { get; set; }
    
    public RawMovieInfo[] Movies { get; set; }
}