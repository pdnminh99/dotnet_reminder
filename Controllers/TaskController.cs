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
    public class TaskController : ControllerBase
    {
        private readonly AppDbContext _context;

        private readonly ILogger<TaskController> _logger;

        private readonly UserManager<AppUser> _userManager;

        public TaskController(
            UserManager<AppUser> userManager,
            AppDbContext dbContext,
            ILogger<TaskController> logger)
        {
            _userManager = userManager;
            _logger = logger;
            _context = dbContext;
        }

        public async Task<IActionResult> GetAll()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                _logger.LogInformation("Unauthenticated user tried to get all tasks.");
                return Forbid();
            }

            _logger.LogInformation($"User [{user.Id}] get all tasks.");

            return Ok(await _context.Collections
                .Where(c => c.Owner == user)
                .OrderBy(c => c.CreationDate)
                .Select(c => new Collection
                {
                    CollectionId = c.CollectionId,
                    Name = c.Name,
                    CreationDate = c.CreationDate,
                    LastEdited = c.LastEdited,
                    Tasks = c.Tasks
                })
                .ToListAsync());
        }

        [HttpGet("Today")]
        public async Task<IActionResult> GetTodayTasks()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                _logger.LogInformation("Unauthenticated user tried to get today's tasks.");
                return Forbid();
            }

            _logger.LogInformation($"User [{user.Id}] get today's tasks.");
            throw new NotImplementedException();
        }

        [HttpGet("Planned")]
        public Task<IActionResult> GetPlanned()
        {
            throw new NotImplementedException();
        }

        [HttpGet("{collectionId}")]
        public Task<IActionResult> GetCollectionTasks(int collectionId)
        {
            throw new NotImplementedException();
        }

        [HttpPost]
        public Task<IActionResult> Create(AppTask instance)
        {
            throw new NotImplementedException();
        }

        [HttpPatch("{taskId}")]
        public async Task<IActionResult> Update(int taskId, [FromBody] AppTask instance)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                _logger.LogInformation($"Unauthenticated user tried to update task [{taskId}].");
                return Forbid();
            }

            AppTask task = await _context.Tasks.FindAsync(taskId);
            if (task == null)
                return NotFound($"Task with id {taskId} is not found.");

            if (task.Collection?.Owner != user)
            {
                _logger.LogInformation(
                    $"User [{user.Id}] tries to update task [{taskId}], " +
                    $"which belongs to user {task.Collection?.Owner?.Id}.");
                return Forbid();
            }

            task.Content = instance.Content;
            task.Note = instance.Note;
            task.DueDate = instance.DueDate;
            task.IsFlagged = instance.IsFlagged;
            task.CompletedAt = instance.CompletedAt;

            await _context.SaveChangesAsync();
            return Ok(task);
        }

        [HttpDelete("{taskId}")]
        public async Task<IActionResult> Delete(int taskId)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                _logger.LogInformation($"Unauthenticated user tried to delete task [{taskId}].");
                return Forbid();
            }

            AppTask task = await _context.Tasks.FindAsync(taskId);
            if (task == null)
                return NotFound($"Task with id {taskId} is not found.");

            if (task.Collection?.Owner != user)
            {
                _logger.LogInformation(
                    $"User [{user.Id}] tries to delete task [{taskId}], " +
                    $"which belongs to user {task.Collection?.Owner?.Id}.");
                return Forbid();
            }

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();
            return Ok(task);
        }

        [HttpPut("{taskId}/{toCollection}")]
        public Task<IActionResult> Move(int taskId, int toCollectionId)
        {
            throw new NotImplementedException();
        }
    }
}