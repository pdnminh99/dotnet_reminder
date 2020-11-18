using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

[Authorize]
[ApiController]
public abstract class GenericController : ControllerBase
{
    protected readonly ApplicationContext Context;

    protected readonly ILogger<GenericController> Logger;

    private readonly UserManager<AppUser> _userManager;

    protected AppUser CurrentUser;

    protected GenericController(
        UserManager<AppUser> userManager,
        ApplicationContext dbContext,
        ILogger<GenericController> logger)
    {
        _userManager = userManager;
        Logger = logger;
        Context = dbContext;
    }

#nullable enable
    protected async Task StartAuthenticate(string? actionName = null)
    {
        CurrentUser = await _userManager.GetUserAsync(User);
        if (CurrentUser == null)
            throw new HttpResponseException($"Unauthenticated user tried to {actionName ?? "access route"}.", 403);
        Logger.LogInformation($"User [{CurrentUser.Id}] can {actionName ?? "access route"}.");
    }
#nullable disable
}