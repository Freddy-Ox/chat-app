using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/login")]
public class LoginController : Controller
{
    private readonly LoginService _loginService;

    public LoginController(LoginService loginService)
    {
        _loginService = loginService;
    }

    [HttpPost]
    public async Task<IActionResult> AuthenticateUserAsync(UserLoginDto loginAttempt)
    {
        var token = await _loginService.AuthenticateUserAsync(loginAttempt);

        return Ok(new { Token = token });
    }
}

public class UserLoginDto()
{
    public required string Username { get; set; }
    public required string Password { get; set; }
}