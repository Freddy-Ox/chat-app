using System.Runtime.CompilerServices;

using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/register")]
public class RegistrationController : Controller
{

    private readonly UsersRepository _usersRepo;
    private readonly PasswordService _pwService;
    public RegistrationController(UsersRepository usersRepo, PasswordService pwService) {        
        _usersRepo = usersRepo;        
        _pwService = pwService;
    }

    [HttpPost]
    public async Task RegisterUser([FromBody] RegisterUserDto newUser) {
        System.Console.WriteLine(newUser.Password);
        string hashedPW = _pwService.HashPassword(newUser.Password);

        User user = new User {Username = newUser.Username, PasswordHash = hashedPW, LastOnline = DateTime.UtcNow};

        await _usersRepo.CreateUser(user);
    }

}

public class RegisterUserDto
{
    public required string Username {get; set;}
    public required string Password {get; set;}
}