using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Reminder.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class CollectionController : ControllerBase
    {
    }
}