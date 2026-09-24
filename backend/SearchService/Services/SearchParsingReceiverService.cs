using Filmograf.BaseLibrary.Util;
using Filmograf.SearchService.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace Filmograf.SearchService.Services;

public class SearchParsingReceiverService
{
    private readonly IHubContext<SearchHub> _searchHubContext;
    public SearchParsingReceiverService(IHubContext<SearchHub> searchHubContext)
    {
        _searchHubContext = searchHubContext;
    }

    // тут короче когда парсинг сервайс завершит поиск на сайте - отправиться запрос на SearchService и он перехватиться здесь
    public async Task HandleParsingResultAsync(string targetRoomId, string[] ids)
    {
        var serializedData = SerializationUtil.Serialize(ids);
        await _searchHubContext.Clients.Group(targetRoomId).SendAsync("ReceiveSearchResult", serializedData);
    }
}