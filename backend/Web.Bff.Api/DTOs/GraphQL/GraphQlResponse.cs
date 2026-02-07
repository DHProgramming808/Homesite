namespace Web.Bff.Api.DTOs.GraphQL;

public class GraphQlResponse<T>
{
    public T? Data { get; set; }
    public object[]? Errors { get; set; } // keep simple; you can type this later
}
