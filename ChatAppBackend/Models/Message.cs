public class Message
{    
    public required int UserId { get; set; }
    public required string Username { get; set; }    
    public required string MessageText { get; set; }
    public required int ChatRoomId {get; set;}

    public override string ToString()
    {
        return $"UserId: {UserId}, Username: {Username}, MessageText: {MessageText}, ChatRoomId: {ChatRoomId}";
    }
    
}