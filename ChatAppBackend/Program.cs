using System.Runtime.CompilerServices;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication.JwtBearer;

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

var jwtSettings = builder.Configuration.GetSection("Jwt");

var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]));

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],
            IssuerSigningKey = key
        };
    });

builder.Services.AddSignalR();
builder.Services.AddScoped<MessagesRepository>();
builder.Services.AddScoped<UsersRepository>();
builder.Services.AddScoped<DatabaseService>();
builder.Services.AddScoped<PasswordService>();
builder.Services.AddScoped<JwtService>();
builder.Services.AddScoped<LoginService>();
builder.Services.AddControllers();

var app = builder.Build();

app.UseCors("AllowFrontend"); 
app.MapControllers();
app.UseRouting();
app.UseAuthorization();
app.MapHub<ChatHub>("/chathub"); 

app.Run();



