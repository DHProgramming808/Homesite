using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text.Json;

//using Shared.DTOs.Auth;
using Web.Bff.Api.DTOs.Auth;
using Web.Bff.Api.Handlers;
using Web.Bff.Api.Helpers;

namespace Web.Bff.Api.Controllers;


[ApiController]
[Route("bff/v1/projects")]
public class ProjectsController : ControllerBase
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILogger<ProjectsController> _logger;

    public ProjectsController(IHttpClientFactory httpClientFactory, Ilogger<ProjectsController> logger)
    {
        _httpClientFactory = httpClientFactory;
        _logger = logger;
    }

    private string CorrelationId =>
        HttpContext.Items["X-Correlation-ID"]?.ToString() // TODO once again don't like the hard coding here
        ?? Request.Headers["X-Correlation-ID"].FirstOrDefault()
        ?? "missing";

    [AllowAnonymous]
    [HttpGet("get-projects")]
    public async Task <IActionResult> GetAllProjects()
    {
        _logger.LogInformation("Get Projects");

        var client = _httpClientFactory.CreateClient("Auth"); //TODO switch over to homesite container.
        var response = await client.PostAsJsonAsync("api/v1/projects/get-projects");

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
            mediaType ?? "text/plain",
            statusCode: statusCode
        ); 
    }

    [AllowAnonymous]
    [HttpGet("get-project/{id}")]
    public async Task <IActionResult> GetProjectById([FromRoute] string id)
    {
        _logger.LogInformation("Get Project By ID");

        var client = _httpClientFactory.CreateClient("Auth");
        var response = await client.PostAsJsonAsync("api/v1/projects/get-projects");

        if (!response.IsSuccessStatusCode)
        {
            _logger.LogWarning("failed to get Recipe {id}");
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
            mediaType ?? "text/plain",
            statusCode: statusCode
        ); 
    }

    // TODO
    // Create Project

    // Delete Project

}