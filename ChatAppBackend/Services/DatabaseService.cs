using Microsoft.Data.Sqlite;

public class DatabaseService()
{
    private readonly string _connectionString = "Data source=/Users/frederikokslund/Documents/Programming/Full Stack/Chat App/chatapp.db";
    

    public SqliteConnection GetConnection()
    {
        return new SqliteConnection(_connectionString);
    }

}