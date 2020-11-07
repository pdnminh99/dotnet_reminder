﻿using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
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
            var user = await _userManager.GetUserAsync(User);
            _logger.LogInformation($"Getting user: {user?.ToString() ?? "null"}");

            if (user == null)
                return Ok(_context.Collections
                    .OrderBy(p => p.CreationDate).ToList());

            return Ok(_context.Collections
                .Where(p => p.Owner == user)
                .OrderBy(p => p.CreationDate)
                .ToList());
        }

        public override async Task<IActionResult> Create(Collection instance)
        {
            var user = await _userManager.GetUserAsync(User);
            instance.Owner = user;

            // User do not customise these fields, they are generated by EF
            instance.CollectionId = null;
            instance.CreationDate = null;
            instance.LastEdited = null;

            // Commit changes
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