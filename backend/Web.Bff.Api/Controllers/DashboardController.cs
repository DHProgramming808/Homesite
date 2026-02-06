using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;
using System.Security.Claims;

namespace Web.Bff.Api.Controllers;


[ApiController]
[Route("api/v1/dashboard")]
public class DashboardController : ControllerBase
{
    private readonly IHttpClientFactory _httpClientFactory;

    public DashboardController(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
    }

    [Authorize]
    [HttpGet]
    public async Task<ActionResult> GetAllRecipesExample() // TODO change to real dashboard data
    {
        //Forward the caller's JWT to downstream services
        var authHeader = Request.Headers.Authorization.ToString();

        var recipesClient = _httpClientFactory.CreateClient("Recipes");
        recipesClient.DefaultRequestHeaders.Authorization =
            AuthenticationHeaderValue.Parse(authHeader); //TODO check this logic

        //Example: call Recipes service to get all recipes
        var recipesResponse = await recipesClient.GetAsync("api/v1/recipes");
        recipesResponse.EnsureSuccessStatusCode(); // TODO handle errors more gracefully
        var recipesJson = await recipesResponse.Content.ReadAsStringAsync();

        //adding user claims from JWT without calling Auth service
        var username = User.FindFirstValue(ClaimTypes.Name) ?? "unknown";
        var role = User.FindFirstValue(ClaimTypes.Role) ?? "User";

        return Ok(new
        {
            User = new
            {
                Username = username,
                Role = role
            },
            Recipes = System.Text.Json.JsonDocument.Parse(recipesJson).RootElement
        });
    }
}
