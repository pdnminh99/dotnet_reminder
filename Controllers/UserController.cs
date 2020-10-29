using Microsoft.AspNetCore.Mvc;

namespace Reminder.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class UserController : ControllerBase
    {
        [HttpGet]
        public string Get() => "Hello World";
    }
}