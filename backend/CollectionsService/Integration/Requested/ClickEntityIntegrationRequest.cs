using System.ComponentModel.DataAnnotations;
using Filmograf.BaseLibrary.Integrations.Payload;

namespace Filmograf.CollectionsService.Integration.Requested;

public class ClickEntityIntegrationRequest : IntegrationRequestPayloadBase
{
    [RegularExpression("^(Movie|Collection)$")]
    public string EntityType { get; set; }
    
    public Guid UserId { get; set; }
    public string EntityId { get; set; }
}