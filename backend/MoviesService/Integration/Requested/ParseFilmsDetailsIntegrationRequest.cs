using System.ComponentModel.DataAnnotations;
using Filmograf.BaseLibrary.Integrations.Payload;
using Filmograf.BaseLibrary.Models.Repo;

namespace Filmograf.MoviesService.Integration.Requested;

public class ParseFilmsDetailsIntegrationRequest : IntegrationRequestPayloadBase
{
    [RegularExpression("^(IMDb|Kinopoisk)$")]
    public string Source { get; set; }
    
    public MovieRepo[] Movies { get; set; }
}