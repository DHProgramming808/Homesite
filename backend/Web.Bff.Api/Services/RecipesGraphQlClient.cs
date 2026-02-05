using System.Net.Http.Headers;
using System.Net.Http.Json;
using Web.Bff.Api.DTOs.GraphQL;

namespace Web.Bff.Api.Services;


public class RecipesGraphQlClient
{
    private readonly IHttpClientFactory _http;


    public RecipesGraphQlClient(IHttpClientFactory http)
    {
        _http = http;
    }


    public async Task<GraphQlResponse<T>> PostAsync<T>(
        GraphQlRequest request,
        string? bearerToken = null, // TODO we have jwt auth, wire this in properly later
        string? correlationId = null,
        CancellationToken cancellationToken = default)
    {
        var client = _http.CreateClient("Recipes");

        if (!string.IsNullOrWhiteSpace(bearerToken))
        {
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", bearerToken);
        }

        if (!string.IsNullOrWhiteSpace(correlationId))
        {
            client.DefaultRequestHeaders.Add("X-Correlation-ID", correlationId);
        }

        var response = await client.PostAsJsonAsync("graphql", request, cancellationToken);
        response.EnsureSuccessStatusCode(); // If Recipes returns non-200, bubble it up (we'll map errors at controller level)

        var data = await response.Content.ReadFromJsonAsync<GraphQlResponse<T>>(cancellationToken: cancellationToken);
        return data ?? new GraphQlResponse<T>();
    }
}
