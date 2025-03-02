using System.Runtime.CompilerServices;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173")
                  .AllowAnyMethod()
                  .AllowCredentials()
                  .AllowAnyHeader();                  
        });
});
builder.Services.AddSignalR();
builder.Services.AddScoped<MessagesRepository>();
builder.Services.AddScoped<UsersRepository>();
builder.Services.AddScoped<DatabaseService>();
builder.Services.AddControllers();

var app = builder.Build();

app.UseCors("AllowFrontend"); 
app.MapControllers();
app.UseRouting();
app.UseAuthorization();
app.MapHub<ChatHub>("/chathub"); 

app.Run();



