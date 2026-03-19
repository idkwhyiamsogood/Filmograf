using System.ComponentModel.DataAnnotations;
using Filmograf.BaseLibrary.Integrations.Payload;

namespace Filmograf.MoviesService.Integration.Requested;

public class CompileChartIntegrationRequest : IntegrationRequestPayloadBase
{
    [RegularExpression("^(FilmTopMovies|Collection)$")]
    public string ChartType { get; set; }
}