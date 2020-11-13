using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Reminder.Data;
using Reminder.Models;

namespace Reminder.Controllers
{
    [Route("api/v1/[controller]")]
    public class CollectionController : GenericController
    {
        public CollectionController(
            UserManager<AppUser> userManager,
            AppDbContext dbContext,
            ILogger<CollectionController> logger) : base(userManager, dbContext, logger)
        {
        }

        [HttpGet]
        public async Task<IActionResult> GetAll(bool includeTasks = false)
        {
            await StartAuthenticate("get all collections");

            return Ok(await Context.Collections
                .Where(c => c.Owner == CurrentUser)
                .OrderBy(c => c.CreationDate)
                .Select(c => new Collection
                {
                    CollectionId = c.CollectionId,
                    Name = c.Name,
                    CreationDate = c.CreationDate,
                    LastEdited = c.LastEdited,
                    Tasks = includeTasks ? c.Tasks : null
                })
                .ToListAsync());
        }

        [HttpPost]
        public async Task<IActionResult> Create(Collection instance)
        {
            await StartAuthenticate("create new collection.");

            instance.Owner = CurrentUser;

            // Commit changes
            await Context.Collections.AddAsync(instance);
            await Context.SaveChangesAsync();
            return Ok(instance);
        }

        [HttpPatch("{collectionId}")]
        public async Task<IActionResult> Update(int collectionId, [FromBody] Collection instance)
        {
            await StartAuthenticate($"update collection [{collectionId}]");

            Collection collection = await Context.Collections.FindAsync(collectionId);
            if (collection == null)
                return NotFound($"Collection with id {collectionId} is not found.");

            if (collection.Owner != CurrentUser)
            {
                Logger.LogInformation(
                    $"User [{CurrentUser.Id}] tries to update collection [{collectionId}], " +
                    $"which belongs to user {collection.Owner?.Id}.");
                return Forbid();
            }

            bool hasChanges = collection.Name != instance.Name;

            // Apply changes
            collection.Name = instance.Name;

            // Commit changes if there are changes
            if (hasChanges)
            {
                collection.LastEdited = DateTime.Now;

                Context.Collections.Update(collection);
                await Context.SaveChangesAsync();
            }

            // Exclude `Owner` field from response
            collection.Owner = null;

            return hasChanges ? Ok(collection) : StatusCode(202, collection);
        }

        [HttpDelete("{collectionId}")]
        public async Task<IActionResult> Delete(int collectionId)
        {
            await StartAuthenticate($"delete collection [{collectionId}]");

            Collection collection = await Context.Collections.FindAsync(collectionId);
            if (collection == null) return NotFound($"Collection [{collectionId}] is not found.");

            if (collection.Owner != CurrentUser)
            {
                Logger.LogCritical(
                    $"User [{CurrentUser.Id}] tries to delete collection [{collection.CollectionId}], " +
                    $"which belongs to user {collection.Owner?.Id}.");
                return Forbid();
            }

            Context.Collections.Remove(collection);
            await Context.SaveChangesAsync();

            collection.Owner = null;
            return Ok(collection);
        }
    }
}