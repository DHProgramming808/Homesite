using System.ComponentModel;

namespace Web.Bff.Api.DTOs;

public class LogoutResponse
{
    public string Status { get; set; } = null!;
    public string Message { get; set; } = null!; // TODO flesh out more if needed
}
