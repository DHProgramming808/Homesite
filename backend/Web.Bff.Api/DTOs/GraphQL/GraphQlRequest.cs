namespace Web.Bff.Api.DTOs.GraphQL;

public class GraphQlRequest
{
    public string Query { get; set; } = null!;
    public object? Variables { get; set; }
    public string? OperationName { get; set; }
}
