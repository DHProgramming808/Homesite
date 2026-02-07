using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text.Json;

//using Shared.DTOs.Auth;
using Web.Bff.Api.DTOs.Auth;
using Web.Bff.Api.DTOs.GraphQL;
using Web.Bff.Api.Handlers;
using Web.Bff.Api.Helpers;
using Web.Bff.Api.Services;

namespace Web.Bff.Api.Controllers;

[ApiController]
[Route("bff/v1/recipes")]
public class RecipesController : ControllerBase
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILogger<RecipesController> _logger;
    private readonly RecipesGraphQlClient _recipes;

    public RecipesController(IHttpClientFactory httpClientFactory, ILogger<RecipesController> logger, RecipesGraphQlClient recipes)
    {
        _httpClientFactory = httpClientFactory;
        _logger = logger;
        _recipes = recipes;
    }

    private string CorrelationId =>
        HttpContext.Items["X-Correlation-ID"]?.ToString() // TODO once again don't like the hard coding here
        ?? Request.Headers["X-Correlation-ID"].FirstOrDefault()
        ?? "missing";


    [AllowAnonymous]
    [HttpGet("featured-recipes")]
    public async Task<IResult> GetFeaturedRecipes()
    {
        var gql = new GraphQlRequest
        {
            Query = """
            query($limit:Int) {
              featuredRecipes(limit: $limit) {
                id title description featured createdByUserId createdAt updatedAt ingredients steps
              }
            }
            """, // TODO move to constants TODO see if we can standarize/consolidate GraphQL queries somewhere
            Variables = new { limit = 10 }
        };

        var bearer = Request.Headers.Authorization.FirstOrDefault()?.ToString(); // TODO proper JWT auth later
        var response = await _recipes.PostAsync<FeaturedData>(gql, bearer, CorrelationId);

        if (response.Errors is {Length: > 0 } errors)
        {
            _logger.LogWarning("GraphQL errors: {Errors}", errors);
            return Results.Json(new { errors }, statusCode: 500); // TODO proper error mapping later
        }

        return Results.Json(response.Data?.GetFeaturedRecipes ?? [], statusCode: 200); // TODO verify structure
    }


    [AllowAnonymous]
    [HttpGet("{id}")]
    public async Task<IResult> GetRecipeById([FromRoute] string id)
    {
        var gql = new GraphQlRequest
        {
            Query = """
            query($id:ID!) {
              getRecipeById(id: $id) {
                id title description featured createdByUserId createdAt updatedAt ingredients steps
              }
            }
            """,
            Variables = new { id }
        };

        var bearer = Request.Headers.Authorization.FirstOrDefault()?.ToString(); // TODO proper JWT auth later
        var response = await _recipes.PostAsync<ByIdData>(gql, bearer, CorrelationId);

        if (response.Errors is { Length: > 0 } errors)
        {
            _logger.LogWarning("GraphQL errors: {Errors}", errors);
            return Results.Json(new { errors }, statusCode: 500); // TODO proper error mapping later
        }

        var recipe = response.Data?.GetRecipeById;
        if (recipe == null)
        {
            return Results.Json(new { message = "Recipe not found" }, statusCode: 404);
        }

        return Results.Json(recipe, statusCode: 200);
    }


    [Authorize]
    [HttpPost]
    public async Task<IResult> CreateRecipe([FromBody] CreateRecipeBody body, CancellationToken ct = default)
    {
        var gql = new GraphQlRequest
        {
            Query = """
            mutation($input:CreateRecipeInput!) {
              createRecipe(input: $input) {
                id title description featured createdByUserId createdAt updatedAt ingredients steps
              }
            }
            """,
            Variables = new
            {
                input = new
                {
                    title = body.Title,
                    description = body.Description,
                    ingredients = body.Ingredients,
                    steps = body.Steps
                }
            }
        };

        var bearer = Request.Headers.Authorization.FirstOrDefault()?.ToString();
        var response = await _recipes.PostAsync<CreateData>(gql, bearer, CorrelationId, ct);

        if (response.Errors is { Length: > 0 } errors)
        {
            _logger.LogWarning("GraphQL errors: {Errors}", errors);
            return Results.Json(new { errors }, statusCode: 500); // TODO proper error mapping later
        }

        var created = response.Data?.CreateRecipe;
        return Results.Json(created, statusCode: 201);
    }


    [Authorize]
    [HttpPost("{id}")]
    public async Task<IResult> DeleteRecipe([FromRoute] string id, CancellationToken ct = default)
    {
        var client = _httpClientFactory.CreateClient("Recipes");

        var bearer = Request.Headers.Authorization.FirstOrDefault()?.ToString();
        if (!string.IsNullOrWhiteSpace(bearer))
        {
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", bearer);
        }

        client.DefaultRequestHeaders.Add("X-Correlation-ID", CorrelationId);

        var response = await _recipes.PostAsync<CreateData>(new GraphQlRequest
        {
            Query = """
            mutation($input:DeleteRecipeInput!) {
              deleteRecipe(input: $input) {
                id
              }
            }
            """
        }, bearer, CorrelationId, ct);

        if(response.Errors is { Length: > 0 } errors)
        {
            _logger.LogWarning("GraphQL errors: {Errors}", errors);
            return Results.Json(new { errors }, statusCode: 500); // TODO proper error mapping later
        }

        return Results.Json(new { message = "Recipe deleted successfully" }, statusCode: 200);
    }


    [AllowAnonymous]
    [HttpGet("health")]
    public async Task<IResult> GetHealth()
    {
        var client = _httpClientFactory.CreateClient("Recipes");
        var response = await client.GetAsync("api/v1/rest-health");

        if (response.IsSuccessStatusCode)
            {
                return await HttpErrorMapper.ToErrorResultAsync(response, CorrelationId);
            }

        var body = await response.Content.ReadAsStringAsync();
        var statusCode = (int)response.StatusCode;
        var mediaType = response.Content.Headers.ContentType?.MediaType;

        if (!string.IsNullOrWhiteSpace(body) && mediaType != null && mediaType.Contains("json"))
        {
            return Results.Json(
                JsonDocument.Parse(body).RootElement,
                statusCode: statusCode
            );
        }

        return Results.Content(
            body ?? "",
            contentType: mediaType ?? "text/plain",
            statusCode: statusCode
        );
    }


    public class FeaturedData { public List<RecipeDto> GetFeaturedRecipes { get; set; } = []; }
    public class ByIdData { public RecipeDto? GetRecipeById { get; set; } }
    public class CreateData { public RecipeDto? CreateRecipe { get; set; } }

    // TODO determine if we want a separate DTOs folder for these
    public record CreateRecipeBody(
        string Title,
        string Description,
        List<string> Ingredients,
        List<string> Steps,
        bool? featured = false
    );

    public record RecipeDto(
        string Id,
        string Title,
        string Description,
        bool Featured,
        string CreatedByUserId,
        DateTime CreatedAt,
        DateTime UpdatedAt,
        List<string> Ingredients,
        List<string> Steps
    );
}
