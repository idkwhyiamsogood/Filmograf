using Filmograf.BaseLibrary.Integrations;
using Filmograf.BaseLibrary.Integrations.Payload;
using RabbitMQ.Client;

namespace ParsingService.Integrations;

public class TestIntegration : IntegrationBase<TestIntegrationRequestPayload, TestIntegrationResponsePayload>
{
    public TestIntegration(IChannel channel, string actionName, string routingKey) : 
        base(channel, actionName, routingKey) { }

    protected override async Task<TestIntegrationResponsePayload> ProcessingAsync(
        IntegrationRequest request, TestIntegrationRequestPayload? payload)
    {
        return new TestIntegrationResponsePayload
        { Value = payload?.Value * 2 ?? 0 };
    }
}