using Microsoft.AspNetCore.Hosting;

[assembly: HostingStartup(typeof(Reminder.Areas.Identity.IdentityHostingStartup))]
namespace Reminder.Areas.Identity
{
    public class IdentityHostingStartup : IHostingStartup
    {
        public void Configure(IWebHostBuilder builder)
        {
            builder.ConfigureServices((context, services) =>
            {
            });
        }
    }
}