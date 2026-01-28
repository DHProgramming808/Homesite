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

    private readonly AuthDbContext _authDb;
    private readonly Iconfiguration _config;

    public UserController(AuthDbContext authDb, Iconfiguration config)
    {
        _authDb = authDb;
        _config = config;
    }


    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest request)
    {
        var user = db.Users.SingleOrDefault(u => u.Email == request.Email);

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
                new Claim(ClaimTypes.NameIdentifier, user.Id,ToString()),
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
            ExpiresAt = DateTime.UtcNow.AddDays(7)
        };

        db.RefreshTokens.Add(refreshToken); //TODO create a nightly jobs class, one job of which is to clear expired refresh tokens
        db.SaveChanges();

        return Ok(new
        {
            accessToken = AccessTokenString,
            refreshToken = refreshToken.Token
        });
    }

    [HttpPost("refresh")]
    public IActionResult Refresh([FromBody] RefreshRequest request)
    {
        var stored = db.RefreshTokens
            .Include(rt => rt.User)
            .SingleOrDefault(rt => rt.Token == request.RefreshToken);

        if (stored == null || stored.Revoked || stored.ExpiresAt < DateTime.UtcNow)
        {
            return Unauthorized();
        }

        storedRevoked = true;

        var nwRefresh = new RefreshToken{

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

        var refreshToken = new RefreshToken
        {
            Token = Guid.NewGuid().ToString(),
            UserId = user.Id,
            ExpiresAt = DateTime.UtcNow.AddDays(7)
        };

        db.RefreshTokens.Add(refreshToken);
        db.SaveChanges();

        return Ok(new
        {
            accessToken = newAccessTokenString,
            refreshToken = refreshToken.Token
        });
    }


    [HttpPost("register")]
    public IActionResult Register([FromBody] RegisterRequest request)
    {
        if (db.User.Any(u => u.Email ==request.Email))
        {
            return BadRequest("Email already in use");
        }
        if (db.User.Any(u => u.Username ==request.Username))
        {
            return BadRequest("Username already in use");
        }

        var hasher = new PasswordHasher<User>();

        var user = new User{
            Email = request.Email,
            Username = request.Username,
            PasswordHash - hasher.HashPassword(null!, request.Password),
            Role = "User"
        }

        db.Users.Add(user);
        db.SaveChanges();

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
