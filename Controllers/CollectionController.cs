using System;
using System.Linq;
using System.Threading.Tasks;
// using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Reminder.Data;
using Reminder.Models;

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

        public override async Task<IActionResult> GetAll()
        {
            await _userManager.GetUserAsync(User);
            return Ok(_context.Collections.OrderBy(p => p.CreationDate).ToList());

            // Unblock this comment when this controller is called with Authorized route

            // Just believe that `GetUserAsync` will never return NULL.
            // Since middleware will redirect unauthorized request.

            // var user = await _userManager.GetUserAsync(User);
            // return _collections
            //     .Where(p => p.Owner.Id == user.Id)
            //     .ToList();
        }

        public override async Task<IActionResult> Create(Collection instance)
        {
            // var user = await _userManager.GetUserAsync(User);
            instance.CollectionId = null;
            instance.CreationDate = null;
            instance.LastEdited = null;
            await _context.Collections.AddAsync(instance);
            await _context.SaveChangesAsync();
            return Ok(instance);
        }

        public override async Task<IActionResult> Update(Collection instance)
        {
            if (instance.CollectionId == null)
                return NotFound($"`id` field must not empty.");
            Collection collection = await _context.Collections.FindAsync(instance.CollectionId);
            if (collection == null) return NotFound($"Collection with id {instance.CollectionId} is not found.");
            collection.Name = instance.Name;
            collection.LastEdited = DateTime.Now;
            _context.Collections.Update(collection);
            await _context.SaveChangesAsync();
            return Ok(collection);
        }

        public override async Task<IActionResult> Delete(int cid)
        {
            Collection collection = await _context.Collections.FindAsync(cid);
            if (collection == null) return NotFound($"Collection with id {cid} is not found.");
            _context.Collections.Remove(collection);
            await _context.SaveChangesAsync();
            return Ok(collection);
        }
    }
}