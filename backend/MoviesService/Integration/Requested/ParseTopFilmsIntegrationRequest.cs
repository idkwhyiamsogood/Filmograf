using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using Filmograf.BaseLibrary.Integrations.Payload;

namespace Filmograf.MoviesService.Integration.Requested;

public class ParseTopFilmsIntegrationRequest : IntegrationRequestPayloadBase
{
    [RegularExpression("^(IMDb|Kinopoisk)$")]
    public string Source { get; set; }
    
    public string Url { get; set; }
    
    [DefaultValue(true)]
    public bool SendDistinctRequest { get; set; } = true;

    [DefaultValue(true)]
    public bool SendUpdateTopPickRequest { get; set; } = true;
}