using Microsoft.AspNetCore.SignalR;

namespace Filmograf.SearchService.Hubs;

public class SearchHub : Hub
{
    public async Task JoinRoom()
    {
        var newRoomId = Guid.NewGuid().ToString();
        await Groups.AddToGroupAsync(Context.ConnectionId, newRoomId);
        await Clients.Group(newRoomId).SendAsync("SettingUpConnection", newRoomId);
        return; 
    }
}