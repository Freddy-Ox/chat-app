using Dapper;
using Microsoft.AspNetCore.Http.Metadata;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;

public class MessagesRepository
{

    private readonly DatabaseService _dbService;

    public MessagesRepository(DatabaseService dbService)
    {
        _dbService = dbService;
    }

    public async Task AddMessageAsync(Message message)
    {        
        try
        {
            using var connection = _dbService.GetConnection();
            connection.Open();
            connection.Execute("PRAGMA foreign_keys = ON;");

            string query = "INSERT INTO Messages (UserId, Username, ChatRoomId, MessageText)" +
                           "VALUES(@UserId, @Username, @ChatRoomId, @MessageText)";

            await connection.ExecuteAsync(query, new { message.UserId, message.Username, message.ChatRoomId, message.MessageText });
        }
        catch (SqliteException ex)
        {
            System.Console.WriteLine($"databsae error: {ex.Message}");
        }
    }

    public async Task<IEnumerable<dynamic>> GetMessagesByUsernameAsync(string username)
    {
        try
        {
            using var connection = _dbService.GetConnection();
            connection.Open();
            connection.Execute("PRAGMA foreign_keys = ON");

            string query = "SELECT * FROM Messages WHERE @Username = username";
            return await connection.QueryAsync(query);

        }
        catch (SqliteException ex)
        {
            System.Console.WriteLine($"dataabase error: {ex.Message}");
            return null;
        }
    }

    public async Task<IEnumerable<dynamic>> GetMessagesAsync()
    {
        try
        {
            using var connection = _dbService.GetConnection();
            connection.Open();
            connection.Execute("PRAGMA foreign_keys = ON");

            string query = "SELECT * FROM Messages";
            return await connection.QueryAsync(query);

        }
        catch (SqliteException ex)
        {
            System.Console.WriteLine($"dataabase error: {ex.Message}");
            return null;
        }
    }
}
