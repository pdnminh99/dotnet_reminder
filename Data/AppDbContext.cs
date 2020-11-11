using System;
using IdentityServer4.EntityFramework.Options;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Reminder.Models;

namespace Reminder.Data
{
    public class AppDbContext : ApiAuthorizationDbContext<AppUser>
    {
        public virtual DbSet<Collection> Collections { get; set; }

        public virtual DbSet<Task> Tasks { get; set; }

        public AppDbContext(DbContextOptions options, IOptions<OperationalStoreOptions> operationalStoreOptions)
            : base(options, operationalStoreOptions)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Collection>()
                .Property(p => p.CreationDate)
                .HasDefaultValue(DateTime.Now);

            builder.Entity<Collection>()
                .Property(p => p.LastEdited)
                .HasDefaultValue(DateTime.Now);

            builder.Entity<Task>()
                .Property(p => p.CreationDate)
                .HasDefaultValue(DateTime.Now);

            builder.Entity<Task>()
                .Property(p => p.LastEdited)
                .HasDefaultValue(DateTime.Now);
        }
    }
}