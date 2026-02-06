using Microsoft.AspNetCore.Mvc;

namespace Auth.Api.Controllers.V1;

[ApiController]
[Route("api/v1/info")]
public class InfoController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new
        {
            name = "Personal Website API",
            framework = ".NET 10",
            version = "v1"
        });
    }
}
