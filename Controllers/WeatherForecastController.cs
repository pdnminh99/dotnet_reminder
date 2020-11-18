using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

[Authorize]
[ApiController]
[Route("[controller]")]
public class WeatherForecastController : ControllerBase
{
    private static readonly string[] Summaries =
    {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

    private readonly UserManager<AppUser> _userManager;

    private readonly SignInManager<AppUser> _signInManager;

    private readonly ILogger<WeatherForecastController> _logger;

    public WeatherForecastController(
        UserManager<AppUser> userManager,
        SignInManager<AppUser> signInManager,
        ILogger<WeatherForecastController> logger)
    => (_signInManager, _userManager, _logger) = (signInManager, userManager, logger);

    [HttpGet]
    public async Task<IEnumerable<WeatherForecast>> Get()
    {
        var rng = new Random();
        var user = await _signInManager.UserManager.GetUserAsync(User);

        _logger.LogCritical($"UserId = {user.Id}");
        _logger.LogCritical($"User email = {user?.Id}");
        _logger.LogCritical($"User name = {user?.UserName}");

        return Enumerable.Range(1, 5).Select(index => new WeatherForecast
        {
            Date = DateTime.Now.AddDays(index),
            TemperatureC = rng.Next(-20, 55),
            Summary = Summaries[rng.Next(Summaries.Length)]
        })
            .ToArray();
    }
}