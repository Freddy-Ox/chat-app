
using System.Threading.Tasks;
using Dapper;
using Microsoft.Data.Sqlite;

public class UsersRepository
{

    private readonly DatabaseService _dbService;

    public UsersRepository(DatabaseService dbService)
    {
        _dbService = dbService;
    }

    public async Task CreateUser(User user)
    {
        using var connection = _dbService.GetConnection();
        connection.Open();
        connection.Execute("PRAGMA foreign_keys = ON;");

        string query = "INSERT INTO Users (Username, PasswordHash, LastOnline) " +
                   "VALUES (@Username, @PasswordHash, @LastOnline)";
        await connection.ExecuteAsync(query, user);

    }

    public async Task<IEnumerable<User>> GetUsers()
    {
        try
        {
            using var connection = _dbService.GetConnection();
            connection.Open();
            connection.Execute("PRAGMA foreign_keys = ON;");

            string query = "SELECT * FROM Users";
            return await connection.QueryAsync<User>(query);

        }
        catch (SqliteException ex)
        {
            System.Console.WriteLine($"database error: {ex.Message}");
            return null;
        }
    }

    public async Task<User?> GetUserByUsernameAsync(string username)
    {
        try
        {
            using var connection = _dbService.GetConnection();
            connection.Open();
            connection.Execute("PRAGMA foreign_keys = ON;");

            string query = "SELECT * FROM Users where @Username = username";
            User? user = await connection.QueryFirstOrDefaultAsync<User>(query, new { Username = username });

            if (user == null)
            {
                System.Console.WriteLine("no such username exists");
            }
            return user;

        }
        catch (SqliteException ex)
        {
            System.Console.WriteLine($"database error: {ex.Message}");
            return null;
        }
    }

    public async Task DeleteUserByUsernameAsync(string username)
    {
        try
        {
            var connection = _dbService.GetConnection();
            connection.Open();
            connection.Execute("PRAGMA foreign_keys = ON;");

            string query = "DELETE * FROM Users where @Username = username";
            await connection.ExecuteAsync(query);

        }
        catch (SqliteException ex)
        {
            System.Console.WriteLine($"database error: {ex.Message}");
        }
    }
}

