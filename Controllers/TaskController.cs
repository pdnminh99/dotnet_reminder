using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Reminder.Data;
using Reminder.Models;

namespace Reminder.Controllers
{
    [Route("api/v1/[controller]")]
    public class TaskController : GenericController
    {
        public TaskController(
            UserManager<AppUser> userManager,
            AppDbContext dbContext,
            ILogger<TaskController> logger) : base(userManager, dbContext, logger)
        {
        }

        [HttpGet("Today")]
        public async Task<IActionResult> GetTodayTasks()
        {
            await StartAuthenticate("get today's tasks");

            throw new NotImplementedException();
        }

        [HttpGet("Planned")]
        public async Task<IActionResult> GetPlanned()
        {
            await StartAuthenticate("get today's tasks");

            throw new NotImplementedException();
        }

        [HttpGet("{collectionId}")]
        public async Task<IActionResult> GetCollectionTasks(int collectionId)
        {
            await StartAuthenticate("get today's tasks");

            Collection collection = await Context.Collections.FindAsync(collectionId);
            if (collection == null) return NotFound($"Collection with id [{collectionId}] is not found.");

            Utils.CheckIfBelongToCurrentUser(collection.Owner, CurrentUser, Logger,
                $"query tasks of collection [{collectionId}]");

            // Exclude `Owner` field from response.
            collection.Owner = null;
            return Ok(collection);
        }

        [HttpPost("{collectionId}")]
        public async Task<IActionResult> Create(int collectionId, [FromBody] AppTask instance)
        {
            await StartAuthenticate($"create task for collection [{collectionId}]");

            Collection collection = await Context.Collections.FindAsync(collectionId);
            if (collection == null) return NotFound($"Collection with id [{collectionId}] is not found.");

            Utils.CheckIfBelongToCurrentUser(collection.Owner, CurrentUser, Logger,
                $"query tasks of collection [{collectionId}]");

            instance.Note ??= "";
            instance.Collection = collection;
            await Context.Tasks.AddAsync(instance);
            await Context.SaveChangesAsync();

            return Ok(instance);
        }

        [HttpPatch("{taskId}")]
        public async Task<IActionResult> Update(int taskId, [FromBody] AppTask instance)
        {
            await StartAuthenticate($"update task [{taskId}]");

            AppTask task = await Context.Tasks.FindAsync(taskId);
            if (task == null)
                return NotFound($"Task with id [{taskId}] is not found.");

            Utils.CheckIfBelongToCurrentUser(task.Collection?.Owner, CurrentUser, Logger, $"update task [{taskId}]");

            // `Content` and `Note` fields must not null. They could be empty.
            // If update request does not include these fields, they will not be changed.
            string newContent = instance.Content ?? task.Content;
            string newNote = instance.Note ?? task.Note;

            bool hasChanges = task.Content != newContent || task.Note != newNote;
            task.Content = newContent;
            task.Note = newNote;

            // These fields are nullable
            hasChanges = hasChanges || task.DueDate != instance.DueDate;
            task.DueDate = instance.DueDate;

            hasChanges = hasChanges || task.IsFlagged != instance.IsFlagged;
            task.IsFlagged = instance.IsFlagged;

            hasChanges = hasChanges || task.CompletedAt != instance.CompletedAt;
            task.CompletedAt = instance.CompletedAt;

            // Commit changes if there are changes
            if (hasChanges)
            {
                task.LastEdited = DateTime.Now;

                Context.Tasks.Update(task);
                await Context.SaveChangesAsync();
            }

            if (task.Collection?.Tasks != null)
                task.Collection.Tasks = null;
            return hasChanges ? Ok(task) : StatusCode(202, task);
        }

        [HttpDelete("{taskId}")]
        public async Task<IActionResult> Delete(int taskId)
        {
            await StartAuthenticate($"delete task [{taskId}]");

            AppTask task = await Context.Tasks.FindAsync(taskId);
            if (task == null)
                return NotFound($"Task with id [{taskId}] is not found.");

            Utils.CheckIfBelongToCurrentUser(task.Collection?.Owner, CurrentUser, Logger, $"delete task [{taskId}]");

            Context.Tasks.Remove(task);
            await Context.SaveChangesAsync();

            if (task.Collection?.Tasks != null)
                task.Collection.Tasks = null;
            return Ok(task);
        }

        [HttpPut("{taskId}/{toCollection}")]
        public Task<IActionResult> Move(int taskId, int toCollectionId)
        {
            throw new NotImplementedException();
        }
    }
}