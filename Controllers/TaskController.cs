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
            if (collection == null) return NotFound($"Collection with id {collectionId} is not found.");

            return Ok(collection);
        }

        [HttpPost("{collectionId}")]
        public async Task<IActionResult> Create(int collectionId, [FromBody] AppTask instance)
        {
            await StartAuthenticate($"create task for collection [{collectionId}]");

            Collection collection = await Context.Collections.FindAsync(collectionId);
            if (collection == null) return NotFound($"Collection with id {collectionId} is not found.");

            instance.Collection = collection;
            await Context.Tasks.AddAsync(instance);
            return Ok(instance);
        }

        [HttpPatch("{taskId}")]
        public async Task<IActionResult> Update(int taskId, [FromBody] AppTask instance)
        {
            await StartAuthenticate($"update task [{taskId}]");

            AppTask task = await Context.Tasks.FindAsync(taskId);
            if (task == null)
                return NotFound($"Task with id {taskId} is not found.");

            if (task.Collection?.Owner != CurrentUser)
            {
                Logger.LogInformation(
                    $"User [{CurrentUser.Id}] tries to update task [{taskId}], " +
                    $"which belongs to user {task.Collection?.Owner?.Id}.");
                return Forbid();
            }

            // `Content` and `Note` fields must not null. They could be empty.
            // If update request does not include these fields, they will not be changed.
            task.Content = instance.Content ?? task.Content;
            task.Note = instance.Note ?? task.Note;
            
            // These fields are nullable
            task.DueDate = instance.DueDate;
            task.IsFlagged = instance.IsFlagged;
            task.CompletedAt = instance.CompletedAt;

            await Context.SaveChangesAsync();
            return Ok(task);
        }

        [HttpDelete("{taskId}")]
        public async Task<IActionResult> Delete(int taskId)
        {
            await StartAuthenticate($"delete task [{taskId}]");

            AppTask task = await Context.Tasks.FindAsync(taskId);
            if (task == null)
                return NotFound($"Task with id {taskId} is not found.");

            if (task.Collection?.Owner != CurrentUser)
            {
                Logger.LogInformation(
                    $"User [{CurrentUser.Id}] tries to delete task [{taskId}], " +
                    $"which belongs to user {task.Collection?.Owner?.Id}.");
                return Forbid();
            }

            Context.Tasks.Remove(task);
            await Context.SaveChangesAsync();
            return Ok(task);
        }

        [HttpPut("{taskId}/{toCollection}")]
        public Task<IActionResult> Move(int taskId, int toCollectionId)
        {
            throw new NotImplementedException();
        }
    }
}