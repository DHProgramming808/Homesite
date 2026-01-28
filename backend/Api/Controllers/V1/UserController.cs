using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;
using Api.DTOs.Auth;

namespace Api.Controllers.V1;

[ApiController]
[Route("api/v1/user")]
public class UserController : ControllerBase
{
    private readonly string secretKey = "temp_key_temp_key_temp_key_temp_key"; // TODO change keys
    private static readonly Dictionary<string, RefreshTokenEntry> RefreshTokens = new(); // TODO we will move refreshToken->user mapping to DB

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
            Expires = DateTime.UtcNow.AddMinutes(1), // TODO configure for prod
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature
            )
        };

        var accessToken = tokenHandler.CreateToken(tokenDescriptor);
        var accessTokenString = tokenHandler.WriteToken(accessToken);

        var refreshToken = Guid.NewGuid().ToString();
        RefreshTokens[refreshToken] = new RefreshTokenEntry
        {
            Username = request.Username,
            Expires = DateTime.UtcNow.AddDays(7)
        };

        return Ok(new
        {
            accessToken = accessTokenString,
            refreshToken
        });
    }

    [HttpPost("refresh")]
    public IActionResult Refresh([FromBody] RefreshRequest request)
    {
        if (!RefreshTokens.TryGetValue(request.RefreshToken, out var entry))
        {
            return Unauthorized();
        }

        if (entry.Expires < DateTime.UtcNow)
        {
            return Unauthorized();
        }

        RefreshTokens.Remove(request.RefreshToken);

        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(secretKey);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.Name, entry.Username)
            }),
            Expires = DateTime.UtcNow.AddMinutes(1), // TODO configuration
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature
            )
        };

        var newAccessToken = tokenHandler.CreateToken(tokenDescriptor);
        var newAccessTokenString = tokenHandler.WriteToken(newAccessToken);

        var newRefreshToken = Guid.NewGuid().ToString();
        RefreshTokens[newRefreshToken] = new RefreshTokenEntry
        {
            Username = entry.Username,
            Expires = DateTime.UtcNow.AddDays(7)
        };

        return Ok(new
        {
            accessToken = newAccessTokenString,
            refreshToken = newRefreshToken
        });
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

public class RefreshRequest
{
    public string RefreshToken { get; set; }

    //TODO refactor for better authentication handling
    public RefreshRequest() {
        RefreshToken = "refresh_token";
    }

    public RefreshRequest(string refreshToken) {
        RefreshToken = refreshToken;
    }
}

class RefreshTokenEntry
{
    public string Username { get; set; }
    public DateTime Expires { get; set; }
}
