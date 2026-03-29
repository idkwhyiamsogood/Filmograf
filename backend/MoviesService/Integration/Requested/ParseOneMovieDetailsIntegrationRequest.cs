using System.ComponentModel.DataAnnotations;
using Filmograf.BaseLibrary.Integrations.Payload;

namespace Filmograf.MoviesService.Integration.Requested;

public class ParseOneMovieDetailsIntegrationRequestPayload : IntegrationRequestPayloadBase
{
    [RegularExpression("^(IMDb|Kinopoisk)$")]
    public string Source { get; set; }
    
    public string MovieId { get; set; }
    
    public string Url { get; set; }
}