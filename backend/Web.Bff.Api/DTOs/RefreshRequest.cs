namespace Web.Bff.Api.DTOs;

public class RefreshRequest
{
    public string AccessToken { get; set; } = null!; // TODO check if we also need the AccessToken for extra security / revoke the Access token
    public string RefreshToken { get; set; } = null!;
    public string ExpiresIn { get; set; } = null!; // TODO flesh out if needed
    public string Status { get; set; } = null!; // TODO flesh out if needed
}
