namespace Web.Bff.Api.DTOs;

public class AuthResponse
{
    public string AccessToken { get; set; } = null!;
    public string RefreshToken { get; set; } = null!;
    public string ExpiresIn { get; set; } = null!; // TODO flesh out if needed
    public string Status { get; set; } = null!; // TODO flesh out if needed
}
