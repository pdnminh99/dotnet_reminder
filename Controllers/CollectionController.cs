using System;
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
    public class CollectionController : ControllerBase
    {
        private readonly AppDbContext _context;

        private readonly ILogger<CollectionController> _logger;

        private readonly UserManager<AppUser> _userManager;

        public CollectionController(
            UserManager<AppUser> userManager,
            AppDbContext dbContext,
            ILogger<CollectionController> logger)
        {
            _userManager = userManager;
            _logger = logger;
            _context = dbContext;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                _logger.LogInformation("Unauthenticated user tried to get all collections.");
                return Forbid();
            }

            _logger.LogInformation($"User [{user.Id}] get all collections.");

            return Ok(await _context.Collections
                .Where(c => c.Owner == user)
                .OrderBy(c => c.CreationDate)
                .Select(c => new Collection
                {
                    CollectionId = c.CollectionId,
                    Name = c.Name,
                    CreationDate = c.CreationDate,
                    LastEdited = c.LastEdited
                })
                .ToListAsync());
        }

        [HttpPost]
        public async Task<IActionResult> Create(Collection instance)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                _logger.LogInformation("Unauthenticated user tried to get all collections.");
                return Forbid();
            }

            instance.Owner = user;

            // Commit changes
            await _context.Collections.AddAsync(instance);
            await _context.SaveChangesAsync();
            return Ok(instance);
        }

        [HttpPatch]
        public async Task<IActionResult> Update(Collection instance)
        {
            if (instance?.CollectionId == null)
                return NotFound($"`id` field must not empty.");

            AppUser user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                _logger.LogInformation("Unauthenticated user tried to get all collections.");
                return Forbid();
            }

            Collection collection = await _context.Collections.FindAsync(instance.CollectionId);
            if (collection == null)
                return NotFound($"Collection with id {instance.CollectionId} is not found.");

            if (collection.Owner != user)
            {
                _logger.LogInformation(
                    $"User [{user.Id}] tries to update collection [{collection.CollectionId}], " +
                    $"which belongs to user {collection.Owner?.Id}.");
                return Forbid();
            }

            collection.Name = instance.Name;
            collection.LastEdited = DateTime.Now;
            _context.Collections.Update(collection);
            await _context.SaveChangesAsync();
            return Ok(collection);
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(int cid)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                _logger.LogInformation("Unauthenticated user tried to get all collections.");
                return Forbid();
            }

            Collection collection = await _context.Collections.FindAsync(cid);
            if (collection == null) return NotFound($"Collection [{cid}] is not found.");

            if (collection.Owner != user)
            {
                _logger.LogCritical(
                    $"User [{user.Id}] tries to delete collection [{collection.CollectionId}], " +
                    $"which belongs to user {collection.Owner?.Id}.");
                return Forbid();
            }

            _context.Collections.Remove(collection);
            await _context.SaveChangesAsync();
            return Ok(collection);
        }
    }
}