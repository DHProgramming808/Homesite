namespace Web.Bff.Api.DTOs;

public class ErrorResponse
{
    public string Error { get; set; } = "Request failed";
    public string Message { get; set; } = "An error occurred while processing the request";
    public int StatusCode { get; set; } = 500;
    public string? CorrelationId { get; set; }
    public object? Details { get; set; }
}
