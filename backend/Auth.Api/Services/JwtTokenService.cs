using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Auth.Api.Services;

public class JwtTokenService
{
    private readonly JwtOptions _jwtOptions;
    private readonly SymmetricSecurityKey _key;


    public JwtTokenService(IOptions<JwtOptions> jwtOptions)
    {
        _jwtOptions = jwtOptions.Value;
        _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtOptions.Key));
    }

    public string WriteAccessToken(User user)
    {
        var token = CreateAccessToken(user);
        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public JwtSecurityToken CreateAccessToken(User user)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Role, user.Role)
        };

        var token = new JwtSecurityToken(
            issuer: _jwtOptions.Issuer,
            audience: _jwtOptions.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(_jwtOptions.AccessTokenMinutes),
            signingCredentials: new SigningCredentials(
                _key,
                SecurityAlgorithms.HmacSha256
        ));

        return token;
    }

    public RefreshToken CreateRefreshToken(User user)
    {
        var refreshToken = new RefreshToken
        {
            Token = Guid.NewGuid().ToString(),
            UserId = user.Id,
            Expires = DateTime.UtcNow.AddDays(_jwtOptions.RefreshTokenDays),
            Revoked = false
        };
        return refreshToken;
    }
}
