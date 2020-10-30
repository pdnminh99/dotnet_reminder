using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
// using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Reminder.Data;
using Reminder.Models;
using Task = System.Threading.Tasks.Task;

namespace Reminder.Controllers
{
    // [Authorize]
    [ApiController]
    [Route("api/v1/[controller]")]
    public class CollectionController : ResourceOperations<Collection, int>
    {
        private readonly ApplicationDbContext _context;

        private readonly ILogger<Collection> _logger;

        private readonly UserManager<User> _userManager;

        public CollectionController(
            UserManager<User> userManager,
            ApplicationDbContext dbContext,
            ILogger<Collection> logger)
        {
            _userManager = userManager;
            _logger = logger;
            _context = dbContext;
        }

        [HttpGet]
        public override Task<List<Collection>> GetAll()
        {
            return Task.FromResult(_context.Collections.ToList());

            // Unblock this comment when this controller is called with Authorized route

            // Just believe that `GetUserAsync` will never return NULL.
            // Since middleware will redirect unauthorized request.

            // var user = await _userManager.GetUserAsync(User);
            // return _collections
            //     .Where(p => p.Owner.Id == user.Id)
            //     .ToList();
        }

        public override async Task<Collection> Create(Collection instance)
        {
            // var user = await _userManager.GetUserAsync(User);
            await _context.Collections.AddAsync(instance);
            await _context.SaveChangesAsync();
            return instance;
        }

        public override Task<Collection> Update(Collection instance)
        {
            throw new NotImplementedException();
        }

        public override async Task<Collection> Delete(int uuid)
        {
            Collection collection = await _context.Collections.FindAsync(uuid);
            _context.Collections.Remove(collection);
            await _context.SaveChangesAsync();
            return collection;
        }
    }
}