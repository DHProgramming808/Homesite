using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

//using Api.Data;
using Shared.DTOs.Auth;
using Auth.Api.Services;
//using Api.Models;

namespace Auth.Api.Controllers.V1;

[ApiController]
[Route("api/v1/user")]
public class UserController : ControllerBase
{
    private readonly string secretKey = "temp_key_temp_key_temp_key_temp_key"; // TODO change keys
    private static readonly Dictionary<string, RefreshTokenEntry> RefreshTokens = new(); // TODO we will move refreshToken->user mapping to _authDb

    private readonly AuthDbContext _authDb;
    private readonly IConfiguration _config;
    private readonly JwtTokenService _jwtTokenService;
    private readonly ILogger<UserController> _logger;

    public UserController(AuthDbContext authDb, IConfiguration config, JwtTokenService jwtTokenService, ILogger<UserController> logger)
    {
        _authDb = authDb;
        _config = config; // TODO use _config to get secretKey, and configure config files
        _jwtTokenService = jwtTokenService;
        _logger = logger;
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
            _logger.LogWarning("Failed login attempt for user {Email}", request.Email);
            return Unauthorized("Invalid password");
        }

        _logger.LogInformation("Login success for userId={UserId}", user.Id);
        var AccessTokenString = _jwtTokenService.WriteAccessToken(user);  //tokenHandler.WriteToken(AccessToken);
        var refreshToken = _jwtTokenService.CreateRefreshToken(user);

        _authDb.RefreshTokens.Add(refreshToken); //TODO create a nightly jobs class, one job of which is to clear expired refresh tokens
        _authDb.SaveChanges();

        return Ok(new
        {
            accessToken = AccessTokenString,
            refreshToken = refreshToken.Token
        });
    }

    [Authorize]
    [HttpPost("logout")]
    public IActionResult Logout([FromBody] LogoutRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); //TODO null check

        var token = _authDb.RefreshTokens
            .SingleOrDefault(rt => rt.Token == request.RefreshToken && rt.Revoked != true);
        // TODO check if we also need the AccessToken for extra security / revoke the Access token

        _logger.LogInformation("Logout attempt userId={UserId}", userId);
        if (userId == null || token == null || token.Revoked || token.Expires < DateTime.UtcNow)
        {
            return Unauthorized();
        }
        if (token.UserId != int.Parse(userId))
        {
            return Unauthorized();
        }

        token.Revoked = true;
        _authDb.SaveChanges();

        return Ok();
    }


    // TODO harness this endpoint in the frontend. the current stub page will become the user profile page, with a "logout all devices" button that calls this endpoint
    [Authorize]
    [HttpPost("logout-all")]
    public IActionResult LogoutAll()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)); //TODO null check

        var userTokens = _authDb.RefreshTokens.Where(rt => rt.UserId == userId && rt.Revoked != true).ToList();
        // TODO check if we also need the AccessToken for extra security / revoke the Access token

        _logger.LogInformation("Logout attempt userId={UserId}", userId);
        if (userId == null || userTokens == null || !userTokens.Any())
        {
            return Unauthorized();
        }

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

        _logger.LogInformation("Refresh attempt for token={TokenPrefix}", request.RefreshToken[..8]);
        if (stored == null || stored.Revoked || stored.Expires < DateTime.UtcNow)
        {
            return Unauthorized();
        }

        var newAccessTokenString = _jwtTokenService.WriteAccessToken(stored.User);;

        stored.Revoked = true;

        var newRefreshToken = _jwtTokenService.CreateRefreshToken(stored.User);

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
        _logger.LogInformation("Registration attempt for email={Email}, username={Username}", request.Email, request.Username);

        if (_authDb.Users.Any(u => u.Email ==request.Email))
        {
            _logger.LogWarning("Registration failed: email already in use: {Email}", request.Email);
            return BadRequest("Email already in use");
        }
        if (_authDb.Users.Any(u => u.Username ==request.Username))
        {
            _logger.LogWarning("Registration failed: username already in use: {Username}", request.Username);
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

        _logger.LogInformation("Registration successful for userId={UserId}", user.Id);
        return Ok(new { message = "registered" });
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
