namespace Web.Bff.Api.DTOs.Auth;

public class LogoutRequest
{
    public string AccessToken { get; set; } = null!; // TODO check if we also need the AccessToken for extra security / revoke the Access token
    public string RefreshToken { get; set; } = null!;
}
