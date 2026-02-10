namespace Web.Bff.Api.DTOs.GraphQL;

public class GraphQlRequest
{
    public string Query { get; set; } = "";
    public object? Variables { get; set; }
    public string? OperationName { get; set; }
}
