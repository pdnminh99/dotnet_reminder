using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Reminder.Controllers
{
    public abstract class ResourceOperations<T, K> : ControllerBase
    {
        [HttpGet]
        public abstract Task<IActionResult> GetAll();

        [HttpPost]
        public abstract Task<IActionResult> Create(T instance);

        [HttpPatch]
        public abstract Task<IActionResult> Update(T instance);

        [HttpDelete]
        public abstract Task<IActionResult> Delete(K uuid);
    }
}