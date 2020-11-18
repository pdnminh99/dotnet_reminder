using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/v1/[controller]")]
public class UserController : ControllerBase
{
    [HttpGet]
    public string Get() => "Hello World";
}
