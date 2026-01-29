using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text.Json;

using Shared.DTOs.Auth;

namespace Web.Bff.Api.Controllers;


[ApiController]
[Route("bff/v1/auth")]
public class AuthController : ControllerBase
{
    private readonly IHttpClientFactory _httpClientFactory;

    public AuthController(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
    }


    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] object request)
    {
        var client = _httpClientFactory.CreateClient("Auth");

        var response = await client.PostAsJsonAsync("api/v1/user/login", request); // TODO change the endpoint address from api to auth or something and sync it with the Controller in Auth.Api
        var body = await response.Content.ReadAsStringAsync();

        return StatusCode((int)response.StatusCode, body); // TODO make sure we are returning the correct structure of the call
    }


    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] object request)
    {
        var client = _httpClientFactory.CreateClient("Auth");

        var response = await client.PostAsJsonAsync("api/v1/user/register", request); // TODO change the endpoint address from api to auth or something and sync it with the Controller in Auth.Api
        var body = await response.Content.ReadAsStringAsync();

        return StatusCode((int)response.StatusCode, body); // TODO make sure we are returning the correct structure of the call
    }


    [AllowAnonymous]
    [HttpPost("refresh-token")]
    public async Task<IActionResult> RefreshToken([FromBody] object request)
    {
        var client = _httpClientFactory.CreateClient("Auth");

        var response = await client.PostAsJsonAsync("api/v1/user/refresh", request); // TODO change the endpoint address from api to auth or something and sync it with the Controller in Auth.Api
        var body = await response.Content.ReadAsStringAsync();

        return StatusCode((int)response.StatusCode, body); // TODO make sure we are returning the correct structure of the call
    }


    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        var client = _httpClientFactory.CreateClient("Auth");

        var authHeader = Request.Headers.Authorization.ToString();
        client.DefaultRequestHeaders.Authorization = AuthenticationHeaderValue.Parse(authHeader);

        var response = await client.PostAsync("api/v1/user/logout", null); // TODO change the endpoint address from api to auth or something and sync it with the Controller in Auth.Api
        var body = await response.Content.ReadAsStringAsync();

        return StatusCode((int)response.StatusCode, body); // TODO make sure we are returning the correct structure of the call
    }


    [Authorize]
    [HttpPost("logout-all")]
    public async Task<IActionResult> LogoutAll()
    {
        var client = _httpClientFactory.CreateClient("Auth");

        var authHeader = Request.Headers.Authorization.ToString();
        client.DefaultRequestHeaders.Authorization = AuthenticationHeaderValue.Parse(authHeader);

        var response = await client.PostAsync("api/v1/user/logout-all", null); // TODO change the endpoint address from api to auth or something and sync it with the Controller in Auth.Api
        var body = await response.Content.ReadAsStringAsync();

        return StatusCode((int)response.StatusCode, body); // TODO make sure we are returning the correct structure of the call
    }


    // TODO stubs
    [Authorize]
    [HttpGet("stub-protected")] // TODO make sure to change this to profile once the auth.api.usercontroller.cs is updated with the profile endpoint
    public async Task<IActionResult> StubProtected()
    {
        var client = _httpClientFactory.CreateClient("Auth");

        var authHeader = Request.Headers.Authorization.ToString();
        client.DefaultRequestHeaders.Authorization = AuthenticationHeaderValue.Parse(authHeader);

        var response = await client.PostAsync("api/v1/user/logout-all", null); // TODO change the endpoint address from api to auth or something and sync it with the Controller in Auth.Api
        var body = await response.Content.ReadAsStringAsync();

        return StatusCode((int)response.StatusCode, body); // TODO make sure we are returning the correct structure of the call
    }


    [Authorize(Roles = "Admin")]
    [HttpGet("admin-only")]
    public async Task<IActionResult> AdminOnly()
    {
        var client = _httpClientFactory.CreateClient("Auth");

        var authHeader = Request.Headers.Authorization.ToString();
        client.DefaultRequestHeaders.Authorization = AuthenticationHeaderValue.Parse(authHeader);

        var response = await client.PostAsync("api/v1/user/logout-all", null); // TODO change the endpoint address from api to auth or something and sync it with the Controller in Auth.Api
        var body = await response.Content.ReadAsStringAsync();

        return StatusCode((int)response.StatusCode, body); // TODO make sure we are returning the correct structure of the call
    }


    [AllowAnonymous]
    [HttpGet("get-info")]
    public async Task<IActionResult> GetInfo()
    {
        var client = _httpClientFactory.CreateClient("Auth");

        var authHeader = Request.Headers.Authorization.ToString();
        client.DefaultRequestHeaders.Authorization = AuthenticationHeaderValue.Parse(authHeader);

        var response = await client.GetAsync("api/v1/info"); // TODO change the endpoint address from api to auth or something and sync it with the Controller in Auth.Api
        var body = await response.Content.ReadAsStringAsync();

        return StatusCode((int)response.StatusCode, body); // TODO make sure we are returning the correct structure of the call
    }


    [AllowAnonymous]
    [HttpGet("get-health")]
    public async Task<IActionResult> GetHealth()
    {
        var client = _httpClientFactory.CreateClient("Auth");

        var response = await client.GetAsync("api/v1/health"); // TODO change the endpoint address from api to auth or something and sync it with the Controller in Auth.Api
        var body = await response.Content.ReadAsStringAsync();

        return StatusCode((int)response.StatusCode, body); // TODO make sure we are returning the correct structure of the call
    }
}
