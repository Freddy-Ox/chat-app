using System.Security.Claims;
using System.Security.Cryptography.X509Certificates;
using Microsoft.AspNetCore.SignalR;
using Microsoft.IdentityModel.Tokens;

public class ChatHub : Hub
{
    private static Dictionary<string, string> _connectedUsers = new Dictionary<string, string>();
    private static Dictionary<string, string> _typingUsers = new Dictionary<string, string>(); 

    // send message
    public async Task SendMessage(string user, string message)
    {
        await Clients.All.SendAsync("ReceiveMessage", user, message);
    }

    // typing indicator
    public async Task UserTyping(string username) {
        _typingUsers[Context.ConnectionId] = username;

        await Clients.All.SendAsync("Typing", _typingUsers.Values.ToList());
    }

    public async Task UserStoppedTyping() {
        if (_typingUsers.Remove(Context.ConnectionId)) {
            await Clients.All.SendAsync("StoppedTyping", _typingUsers.Values.ToList());
        }
    }

    // active users
    public async Task GetActiveUsers() {
        await Clients.All.SendAsync("QueryActiveUsers", _connectedUsers.Values.ToList());
    }

    public override async Task OnConnectedAsync()
    {
        var username = Context.User?.FindFirst(ClaimTypes.Name)?.Value;
        //var token = Context.GetHttpContext()?.Request.Query["access_token"];
        
        if (!string.IsNullOrEmpty(username))
        {
            _connectedUsers[Context.ConnectionId] = username;
            await Clients.All.SendAsync("UserConnected", username, _connectedUsers.Values.ToList());
        }

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        if (_connectedUsers.TryGetValue(Context.ConnectionId, out var username))
        {
            _connectedUsers.Remove(Context.ConnectionId);            
            await Clients.All.SendAsync("UserDisconnected", _connectedUsers.Values.ToList());
        }

        await base.OnDisconnectedAsync(exception);
    }
}