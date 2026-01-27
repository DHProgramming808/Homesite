using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;

namespace Api.Controllers.V1;

[ApiController]
[Route("api/v1/user")]
public class UserController : ControllerBase
{
    private readonly string secretKey = "temp_key_temp_key_temp_key_temp_key"; // TODO change keys

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest request)
    {
        // TODO stub username and password
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(secretKey);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.Name, request.Username)
            }),
            Expires = DateTime.UtcNow.AddHours(1),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return Ok(new { token = tokenHandler.WriteToken(token) });
    }


    [Authorize]
    [HttpGet("stub-protected")]
    public IActionResult StubProtected()
    {
        return Ok(new { message = $"Hello {User.Identity.Name}, this is a protected stub page"}); // TODO change this to redirect to user profile page
    }
}


public class LoginRequest
{
    public String Username { get; set; }
    public String Password { get; set; }

    //TODO refactor for better authentication handling
    public LoginRequest() {
        Username = "username";
        Password = "password";
    }
    public LoginRequest(string username, string password)
    {
        Username = username;
        Password = password;
    }
}
