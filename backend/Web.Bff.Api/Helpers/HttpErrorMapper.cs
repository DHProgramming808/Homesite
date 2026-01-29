using System.Text.Json;
using Web.Bff.Api.DTOs.Auth;

namespace Web.Bff.Api.Helpers;

public static class HttpErrorMapper
{
    public static async Task<IResult> ToErrorResultAsync(HttpResponseMessage response, string correlationId)
    {
        // TODO map different error codes to different structures
        // TODO log the error with correlationId for tracking
        // TODO try catch block
        var status = (int)response.StatusCode;
        var raw = await response.Content.ReadAsStringAsync();

        object? details = null;
        string message = "Request failed";

        if (!string.IsNullOrWhiteSpace(raw))
        {
            try
            {
                var jsonDoc = JsonDocument.Parse(raw);
                if (jsonDoc.RootElement.TryGetProperty("message", out var messageElement))
                {
                    message = messageElement.GetString() ?? message;
                }
                details = jsonDoc.RootElement; // TODO verify correct structure
            }
            catch (JsonException)
            {
                message = raw;
            }
        }

        var error = new ErrorResponse
        {
            StatusCode = status,
            CorrelationId = correlationId,
            Message = message,
            Details = details
        };

        return Results.Json(error, statusCode: status);
    }
}
