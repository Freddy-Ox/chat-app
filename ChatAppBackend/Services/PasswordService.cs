
using Microsoft.AspNetCore.Identity;

public class PasswordService {

    private readonly PasswordHasher<object> _passwordHasher = new PasswordHasher<object>();

    public string HashPassword(string password) {
        return _passwordHasher.HashPassword(null, password);
    }

    public bool VerifyPassword(string hashedPW, string providedPW) {
        var result =_passwordHasher.VerifyHashedPassword(null, hashedPW, providedPW);
        return result == PasswordVerificationResult.Success;
    } 

}