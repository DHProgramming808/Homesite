using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

//using Api.Data;
using Api.DTOs.Auth;
//using Api.Models;

namespace Api.Controllers.V1;

[ApiController]
[Route("api/v1/user")]
public class UserController : ControllerBase
{
    private readonly string secretKey = "temp_key_temp_key_temp_key_temp_key"; // TODO change keys
    private static readonly Dictionary<string, RefreshTokenEntry> RefreshTokens = new(); // TODO we will move refreshToken->user mapping to _authDb

    private readonly AuthDbContext _authDb;
    private readonly IConfiguration _config;

    public UserController(AuthDbContext authDb, IConfiguration config)
    {
        _authDb = authDb;
        _config = config; // TODO use _config to get secretKey, and configure config files
    }


    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest request)
    {
        var user = _authDb.Users.SingleOrDefault(u => u.Email == request.Email);

        if (user == null)
        {
            return Unauthorized("User not found");
        }

        var hasher = new PasswordHasher<User>();
        var result = hasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);

        if (result == PasswordVerificationResult.Failed)
        {
            return Unauthorized("Invalid password");
        }


        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(secretKey);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role)
            }),
            Expires = DateTime.UtcNow.AddMinutes(1), // TODO configure for prod
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature
            )
        };

        var AccessToken = tokenHandler.CreateToken(tokenDescriptor);
        var AccessTokenString = tokenHandler.WriteToken(AccessToken);

        var refreshToken = new RefreshToken
        {
            Token = Guid.NewGuid().ToString(),
            UserId = user.Id,
            Expires = DateTime.UtcNow.AddDays(7)
        };

        _authDb.RefreshTokens.Add(refreshToken); //TODO create a nightly jobs class, one job of which is to clear expired refresh tokens
        _authDb.SaveChanges();

        return Ok(new
        {
            accessToken = AccessTokenString,
            refreshToken = refreshToken.Token
        });
    }


    [HttpPost("logout")]
    public IActionResult Logout([FromBody] LogoutRequest request)
    {
        var token = _authDb.RefreshTokens
            .SingleOrDefault(rt => rt.Token == request.RefreshToken);

        if (token == null || token.Revoked || token.Expires < DateTime.UtcNow)
        {
            return Unauthorized();
        }

        token.Revoked = true;
        _authDb.SaveChanges();

        return Ok();
    }


    //
    [Authorize]
    [HttpPost("logout-all")]
    public IActionResult LogoutAll()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)); //TODO null check

        var userTokens = _authDb.RefreshTokens.Where(rt => rt.UserId == userId);
        foreach (var userToken in userTokens)
        {
            userToken.Revoked = true;
        }

        _authDb.SaveChanges();
        return Ok();
    }


    [HttpPost("refresh")]
    public IActionResult Refresh([FromBody] RefreshRequest request)
    {
        var stored = _authDb.RefreshTokens
            .Include(rt => rt.User)
            .SingleOrDefault(rt => rt.Token == request.RefreshToken);

        if (stored == null || stored.Revoked || stored.Expires < DateTime.UtcNow)
        {
            return Unauthorized();
        }


        var tokenHandler = new JwtSecurityTokenHandler(); // TODO change to var jwtKey = _config.GetValue<string>("JwtKey");
        var key = Encoding.ASCII.GetBytes(secretKey);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, stored.User.Id.ToString()),
                new Claim(ClaimTypes.Email, stored.User.Email),
                new Claim(ClaimTypes.Name, stored.User.Username),
                new Claim(ClaimTypes.Role, stored.User.Role)

            }),
            Expires = DateTime.UtcNow.AddMinutes(1), // TODO configuration
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature
            )
        };

        var newAccessToken = tokenHandler.CreateToken(tokenDescriptor);
        var newAccessTokenString = tokenHandler.WriteToken(newAccessToken);

        stored.Revoked = true;

        var newRefreshToken = new RefreshToken{
            Token = Guid.NewGuid().ToString(),
            UserId = stored.UserId,
            Expires = DateTime.UtcNow.AddDays(7)
        };

        _authDb.RefreshTokens.Add(newRefreshToken);
        _authDb.SaveChanges();

        return Ok(new
        {
            accessToken = newAccessTokenString,
            refreshToken = newRefreshToken.Token
        });
    }


    [HttpPost("register")]
    public IActionResult Register([FromBody] RegisterRequest request)
    {
        if (_authDb.Users.Any(u => u.Email ==request.Email))
        {
            return BadRequest("Email already in use");
        }
        if (_authDb.Users.Any(u => u.Username ==request.Username))
        {
            return BadRequest("Username already in use");
        }

        var hasher = new PasswordHasher<User>();

        var user = new User{
            Email = request.Email,
            Username = request.Username,
            PasswordHash = hasher.HashPassword(null!, request.Password),
            Role = "User"
        };

        _authDb.Users.Add(user);
        _authDb.SaveChanges();

        return Ok();
    }


    [Authorize]
    [HttpGet("stub-protected")]
    public IActionResult StubProtected()
    {
        return Ok(new { message = $"Hello {User.Identity.Name}, this is a protected stub page"}); // TODO change this to redirect to user profile page
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("admin-only")]
    public IActionResult AdminOnly()
    {
        return Ok("Welcome admin");
    }
}

class RefreshTokenEntry
{
    public string Username { get; set; }
    public DateTime Expires { get; set; }
}
