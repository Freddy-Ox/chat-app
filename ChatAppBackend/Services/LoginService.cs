using Microsoft.AspNetCore.Mvc;

public class LoginService : Controller
{

    private readonly UsersRepository _usersRepo;
    private readonly PasswordService _pwService;
    private readonly JwtService _jwtService;

    public LoginService(UsersRepository usersRepo, PasswordService pwService, JwtService jwtService)
    {
        _usersRepo = usersRepo;
        _pwService = pwService;
        _jwtService = jwtService;
    }

    async public Task<LoginReponseDto?> AuthenticateUserAsync(UserLoginDto loginDto)
    {
        var user = await _usersRepo.GetUserByUsernameAsync(loginDto.Username);
        if (user == null)
        {
            return null;
        }

        bool verificationResult = _pwService.VerifyPassword(user.PasswordHash, loginDto.Password);
        if (!verificationResult)
        {
            return null;
        }

        var token = _jwtService.GenerateToken(user);
        return new LoginReponseDto {Token = token, Username = loginDto.Username};
    }    

}

public class LoginReponseDto
    {
        public required string Token { get; set; }
        public required string Username { get; set; }
    }