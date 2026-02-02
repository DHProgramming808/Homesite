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
[Route("bff/v1/recipes")]
public class RecipesController : ControllerBase
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILogger<RecipesController> _logger;

    public RecipesController(IHttpClientFactory httpClientFactory, ILogger<RecipesController> logger)
    {
        _httpClientFactory = httpClientFactory;
        _logger = logger;
    }

    private string CorrelationId =>
        HttpContext.Items["X-Correlation-ID"]?.ToString() // TODO once again don't like the hard coding here
        ?? Request.Headers["X-Correlation-ID"].FirstOrDefault()
        ?? "missing";

    [AllowAnonymous]
    [HttpGet("test")]
    public IActionResult Test()
    {
        _logger.LogInformation("Test endpoint called with correlation ID: {CorrelationId}", CorrelationId);
        return Ok(new { message = "Test endpoint works!", correlationId = CorrelationId });
    }
}
