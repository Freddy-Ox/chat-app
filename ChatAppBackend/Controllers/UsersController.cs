using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/users")]

public class UsersController
{
    private readonly UsersRepository _usersRepo;

    public UsersController(UsersRepository userRepo) {
        _usersRepo = userRepo;
    }

    [HttpPost]
    public async Task AddUserAsync(User user) {
        await _usersRepo.CreateUser(user);
    }

    [HttpGet]
    public async Task<User> GetUserAsync(string username) {
        var user = await _usersRepo.GetUserByUsernameAsync(username);
        return user;
    }

    [HttpGet] 
    public async Task<IEnumerable<User>> GetUsersAsync() {
        var users = await _usersRepo.GetUsers();
        return users;
    }

}

