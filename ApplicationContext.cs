using System;
using IdentityServer4.EntityFramework.Options;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System.IO;

// Ref: https://stackoverflow.com/questions/59009996/add-migration-for-apiauthorizationdbcontext-from-another-project-ef-core
public class OperationalStoreOptionsMigrations :
  IOptions<OperationalStoreOptions>
{
    public OperationalStoreOptions Value => new OperationalStoreOptions()
    {
        DeviceFlowCodes = new TableConfiguration("DeviceCodes"),
        EnableTokenCleanup = false,
        PersistedGrants = new TableConfiguration("PersistedGrants"),
        TokenCleanupBatchSize = 100,
        TokenCleanupInterval = 3600,
    };
}

public class DesignTimeDbContextFactory :
   IDesignTimeDbContextFactory<ApplicationContext>
{
    public ApplicationContext CreateDbContext(string[] args)
    {
        IConfiguration configuration = new ConfigurationBuilder()
             .SetBasePath(Directory.GetCurrentDirectory())
             .AddJsonFile("appsettings.json")
             .Build();

        var builder = new DbContextOptionsBuilder<ApplicationContext>();
        builder
            .UseLazyLoadingProxies()
            .UseSqlite(configuration.GetConnectionString("DefaultConnection"));
        return new ApplicationContext(builder.Options, new OperationalStoreOptionsMigrations(), configuration);
    }
}

public class ApplicationContext : ApiAuthorizationDbContext<AppUser>
{
    private readonly IConfiguration _configuration;

    public virtual DbSet<Collection> Collections { get; set; }

    public virtual DbSet<AppTask> Tasks { get; set; }

    public ApplicationContext(
        DbContextOptions options,
        IOptions<OperationalStoreOptions> operationalStoreOptions,
        IConfiguration configuration)
        : base(options, operationalStoreOptions) => _configuration = configuration;

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) =>
            optionsBuilder.UseSqlite(_configuration.GetConnectionString("DefaultConnection"));

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<Collection>()
            .Property(p => p.CreationDate)
            .HasDefaultValue(DateTime.Now);

        builder.Entity<Collection>()
            .Property(p => p.LastEdited)
            .HasDefaultValue(DateTime.Now);

        builder.Entity<AppTask>()
            .Property(p => p.CreationDate)
            .HasDefaultValue(DateTime.Now);

        builder.Entity<AppTask>()
            .Property(p => p.LastEdited)
            .HasDefaultValue(DateTime.Now);

        builder.Entity<Collection>()
            .HasMany(p => p.Tasks)
            .WithOne(t => t.Collection)
            .OnDelete(DeleteBehavior.Cascade);
    }
}