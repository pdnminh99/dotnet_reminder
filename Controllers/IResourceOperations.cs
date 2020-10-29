using System.Collections.Generic;
using System.Threading.Tasks;
using Reminder.Models;

namespace Reminder.Controllers
{
    public interface IResourceOperations<T, K>
    {
        public Task<List<Collection>> GetAll();

        public Task<T> Create(T instance);

        public Task<T> Update(T instance);

        public Task<T> Delete(K uuid);
    }
}