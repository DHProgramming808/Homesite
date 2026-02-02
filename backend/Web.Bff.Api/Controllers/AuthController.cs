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
[Route("bff/v1/auth")]
public class AuthController : ControllerBase
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IHttpClientFactory httpClientFactory, ILogger<AuthController> logger)
    {
        _httpClientFactory = httpClientFactory;
        _logger = logger;
    }

    private string CorrelationId =>
        HttpContext.Items["X-Correlation-ID"]?.ToString() // TODO once again don't like the hard coding here
        ?? Request.Headers["X-Correlation-ID"].FirstOrDefault()
        ?? "missing";


    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<IResult> Login([FromBody] LoginRequest request)
    {
        _logger.LogInformation("Login attempt for {Email}", request.Email); // TODO verify the structure of request to make sure it has Email property

        var client = _httpClientFactory.CreateClient("Auth");
        var response = await client.PostAsJsonAsync("api/v1/user/login", request); // TODO change the endpoint address from api to auth or something and sync it with the Controller in Auth.Api

        if (!response.IsSuccessStatusCode)
        {
            return await HttpErrorMapper.ToErrorResultAsync(response, CorrelationId);
            //_logger.LogWarning("Login failed for {Email} with status code {StatusCode}", request.Email, response.StatusCode); // TODO do I really want to log logins?
        }
        else
        {
            //_logger.LogInformation("Login successful for {Email}", request.Email); // TODO do I really want to log logins?
        }

        var body = await response.Content.ReadAsStringAsync();

        return Results.Ok(JsonDocument.Parse(body).RootElement); // TODO make sure we are returning the correct structure of the call. status code?
    }


    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<IResult> Register([FromBody] RegisterRequest request)
    {
        _logger.LogInformation("Registration attempt for {Email}", request.Email); // TODO verify the structure of request to make sure it has Email property

        var client = _httpClientFactory.CreateClient("Auth");
        var response = await client.PostAsJsonAsync("api/v1/user/register", request); // TODO change the endpoint address from api to auth or something and sync it with the Controller in Auth.Api

        if (!response.IsSuccessStatusCode)
        {
            _logger.LogWarning("Registration failed for {Email} with status code {StatusCode}", request.Email, response.StatusCode);
            return await HttpErrorMapper.ToErrorResultAsync(response, CorrelationId);
        }
        else
        {
            _logger.LogInformation("Registration successful for {Email}", request.Email);
        }

        var body = await response.Content.ReadAsStringAsync();

        return Results.Ok(JsonDocument.Parse(body).RootElement); // TODO make sure we are returning the correct structure of the call. status code?
    }


    [AllowAnonymous]
    [HttpPost("refresh-token")]
    public async Task<IResult> RefreshToken([FromBody] object request)
    {
        var client = _httpClientFactory.CreateClient("Auth");
        var response = await client.PostAsJsonAsync("api/v1/user/refresh", request); // TODO change the endpoint address from api to auth or something and sync it with the Controller in Auth.Api

        if (!response.IsSuccessStatusCode)
        {
            return await HttpErrorMapper.ToErrorResultAsync(response, CorrelationId);
        }

        var body = await response.Content.ReadAsStringAsync();

        return Results.Ok(JsonDocument.Parse(body).RootElement); // TODO make sure we are returning the correct structure of the call. status code?
     }


    [Authorize]
    [HttpPost("logout")]
    public async Task<IResult> Logout()
    {
        var client = _httpClientFactory.CreateClient("Auth");

        var authHeader = Request.Headers.Authorization.ToString();
        if (!string.IsNullOrEmpty(authHeader))
        {
            client.DefaultRequestHeaders.Authorization = AuthenticationHeaderValue.Parse(authHeader);
        }

        var response = await client.PostAsync("api/v1/user/logout", null); // TODO change the endpoint address from api to auth or something and sync it with the Controller in Auth.Api

        if (!response.IsSuccessStatusCode)
        {
            return await HttpErrorMapper.ToErrorResultAsync(response, CorrelationId);
        }

        var body = await response.Content.ReadAsStringAsync();

        return Results.Json(body); // TODO make sure we are returning the correct structure of the call
    }


    [Authorize]
    [HttpPost("logout-all")]
    public async Task<IResult> LogoutAll()
    {
        var client = _httpClientFactory.CreateClient("Auth");

        var authHeader = Request.Headers.Authorization.ToString();
        if (!string.IsNullOrEmpty(authHeader))
        {
            client.DefaultRequestHeaders.Authorization = AuthenticationHeaderValue.Parse(authHeader);
        }

        var response = await client.PostAsync("api/v1/user/logout-all", null); // TODO change the endpoint address from api to auth or something and sync it with the Controller in Auth.Api

        if (!response.IsSuccessStatusCode)
        {
            return await HttpErrorMapper.ToErrorResultAsync(response, CorrelationId);
        }

        var body = await response.Content.ReadAsStringAsync();

        return Results.Json(body); // TODO make sure we are returning the correct structure of the call
    }


    // TODO stubs
    // TODO Also Move these functions to a different controller like UserController once implemented properly
    [Authorize]
    [HttpGet("stub-protected")] // TODO make sure to change this to profile once the auth.api.usercontroller.cs is updated with the profile endpoint
    public async Task<IResult> StubProtected()
    {
        var client = _httpClientFactory.CreateClient("Auth");

        var authHeader = Request.Headers.Authorization.ToString();
        if (!string.IsNullOrEmpty(authHeader))
        {
            client.DefaultRequestHeaders.Authorization = AuthenticationHeaderValue.Parse(authHeader);
        }

        client.DefaultRequestHeaders.Authorization = AuthenticationHeaderValue.Parse(authHeader);

        var response = await client.PostAsync("api/v1/user/logout-all", null); // TODO change the endpoint address from api to auth or something and sync it with the Controller in Auth.Api
        var body = await response.Content.ReadAsStringAsync();

        return Results.Json(body); // TODO make sure we are returning the correct structure of the call
    }


    [Authorize(Roles = "Admin")]
    [HttpGet("admin-only")]
    public async Task<IResult> AdminOnly()
    {
        var client = _httpClientFactory.CreateClient("Auth");

        var authHeader = Request.Headers.Authorization.ToString();
        if (!string.IsNullOrEmpty(authHeader))
        {
            client.DefaultRequestHeaders.Authorization = AuthenticationHeaderValue.Parse(authHeader);
        }

        client.DefaultRequestHeaders.Authorization = AuthenticationHeaderValue.Parse(authHeader);

        var response = await client.PostAsync("api/v1/user/logout-all", null); // TODO change the endpoint address from api to auth or something and sync it with the Controller in Auth.Api

        if (!response.IsSuccessStatusCode)
        {
            return await HttpErrorMapper.ToErrorResultAsync(response, CorrelationId);
        }

        var body = await response.Content.ReadAsStringAsync();

        return Results.Json(body); // TODO make sure we are returning the correct structure of the call
    }


    [AllowAnonymous]
    [HttpGet("get-info")]
    public async Task<IResult> GetInfo()
    {
        var client = _httpClientFactory.CreateClient("Auth");
        var response = await client.GetAsync("api/v1/info"); // TODO change the endpoint address from api to auth or something and sync it with the Controller in Auth.Api

        if (!response.IsSuccessStatusCode)
        {
            return await HttpErrorMapper.ToErrorResultAsync(response, CorrelationId);
        }

        var body = await response.Content.ReadAsStringAsync();

        return Results.Json(body); // TODO make sure we are returning the correct structure of the call
    }


    [AllowAnonymous]
    [HttpGet("get-health")]
    public async Task<IResult> GetHealth()
    {
        var client = _httpClientFactory.CreateClient("Auth");
        var response = await client.GetAsync("api/v1/health"); // TODO change the endpoint address from api to auth or something and sync it with the Controller in Auth.Api

        if (!response.IsSuccessStatusCode)
        {
            return await HttpErrorMapper.ToErrorResultAsync(response, CorrelationId);
        }

        var body = await response.Content.ReadAsStringAsync();

        return Results.Json(body); // TODO make sure we are returning the correct structure of the call
    }
}
