using Filmograf.BaseLibrary.Integrations.Payload;
using Filmograf.BaseLibrary.Models.Dto;

namespace Filmograf.SearchService.Integration.Requested;

public class ParseSearchingIntegrationRequestPayload : IntegrationRequestPayloadBase
{
    public Guid ParsingTaskId { get; set; }
    public string Query { get; set; }
    public IntegrationReplyDto[] ReplyProps { get; set; }
}