using System.ComponentModel.DataAnnotations;
using Filmograf.BaseLibrary.Integrations.Payload;

namespace Filmograf.CollectionsService.Integration.Requested;

public class CompileChartIntegrationRequest : IntegrationRequestPayloadBase
{
    [RegularExpression("^(FilmTopMovies|FilmTopCollections)$")]
    public string ChartType { get; set; }
}