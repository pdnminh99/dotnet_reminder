using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Reminder.Data;
using Reminder.Models;

namespace Reminder.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/v1/[controller]")]
    public class CollectionController : ControllerBase, IResourceOperations<Collection, Guid>
    {
        private readonly DbSet<Collection> _collections;

        private readonly ILogger<Collection> _logger;

        private readonly UserManager<User> _userManager;

        public CollectionController(
            UserManager<User> userManager,
            ApplicationDbContext dbContext,
            ILogger<Collection> logger)
        {
            _userManager = userManager;
            _logger = logger;
            _collections = dbContext.Collections;
        }

        [HttpGet]
        public async Task<List<Collection>> GetAll()
        {
            _logger.LogInformation("Get all collections action invoked.");

            // Just believe that `GetUserAsync` will never return NULL.
            // Since middleware will redirect unauthorized request. 
            var user = await _userManager.GetUserAsync(User);
            return _collections
                .Where(p => p.Owner.Id == user.Id)
                .ToList();
        }

        [HttpPost]
        public async Task<Collection> Create(Collection instance)
        {
            var user = await _userManager.GetUserAsync(User);
            _collections.Add(instance);
            return instance;
        }

        [HttpPatch]
        public Task<Collection> Update(Collection instance)
        {
            throw new NotImplementedException();
        }

        [HttpDelete]
        public Task<Collection> Delete(Guid uuid)
        {
            throw new NotImplementedException();
        }
    }
}