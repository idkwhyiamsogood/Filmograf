using Filmograf.BaseLibrary.Integrations;
using Filmograf.BaseLibrary.Integrations.Payload;
using Filmograf.BaseLibrary.Models.IntegrationExceptions;
using Filmograf.BaseLibrary.Util;
using RabbitMQ.Client;

namespace Filmograf.MoviesService.Integration;

public class BaseIntegrationSender
{
    protected readonly IChannel _channel;
    protected readonly string _actionName;
    protected readonly string _requestQueue;
    protected readonly string _responseQueue;
    
    // Для отслеживания ожидающих ответов
    protected readonly Dictionary<string, TaskCompletionSource<IntegrationResponse>> _pendingRequests;

    public BaseIntegrationSender(IChannel channel, string actionName, string requestQueue, string responseQueue)
    {
        _channel = channel;
        _actionName = actionName;
        _requestQueue = requestQueue;
        _responseQueue = responseQueue;
        _pendingRequests = new Dictionary<string, TaskCompletionSource<IntegrationResponse>>();
    }

     public async Task<TResponse> SendRequestAsync<TRequest, TResponse>(TRequest? payload = null)
        where TRequest : IntegrationRequestPayloadBase
        where TResponse : IntegrationResponsePayloadBase
    {
        var requestId = Guid.NewGuid().ToString();
        
        var request = new IntegrationRequest
        {
            RequestId = requestId,
            Action = _actionName,
            Payload = payload != null ? SerializationUtil.Serialize(payload) : null
        };

        var tcs = new TaskCompletionSource<IntegrationResponse>();
        _pendingRequests[requestId] = tcs;

        var requestBytes = SerializationUtil.SerializeToBytes(request);
        
        await _channel.BasicPublishAsync(
            exchange: "",
            routingKey: _requestQueue,
            body: requestBytes
        );

        // Ждем ответа с таймаутом 30 секунд
        var timeoutTask = Task.Delay(TimeSpan.FromSeconds(30));
        var completedTask = await Task.WhenAny(tcs.Task, timeoutTask);
        
        if (completedTask == timeoutTask)
        {
            _pendingRequests.Remove(requestId);
            throw new TimeoutException($"Request {requestId} timed out after 30 seconds");
        }

        var response = await tcs.Task;
        
        if (!response.Success)
        {
            throw new IntegrationException(response.ErrorMessage ?? "Unknown error", response.Payload);
        }

        // Десериализуем payload ответа
        if (string.IsNullOrEmpty(response.Payload))
        {
            throw new InvalidOperationException("Response payload is empty");
        }

        var responsePayload = SerializationUtil.Deserialize<TResponse>(response.Payload);
        if (responsePayload == null)
        {
            throw new InvalidOperationException("Failed to deserialize response payload");
        }

        return responsePayload;
    }

    public virtual Task ProcessResponseAsync(IntegrationResponse response)
    {
        if (_pendingRequests.TryGetValue(response.RequestId, out var tcs))
        {
            _pendingRequests.Remove(response.RequestId);
            tcs.SetResult(response);
        }
        
        return Task.CompletedTask;
    }
}