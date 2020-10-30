using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Reminder.Controllers
{
    public abstract class ResourceOperations<T, K> : ControllerBase
    {
        [HttpGet]
        public abstract Task<List<T>> GetAll();

        [HttpPost]
        public abstract Task<T> Create(T instance);

        [HttpPatch]
        public abstract Task<T> Update(T instance);

        [HttpDelete]
        public abstract Task<T> Delete(K uuid);
    }
}