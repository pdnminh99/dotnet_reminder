using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

Host.CreateDefaultBuilder(args)
    .ConfigureWebHostDefaults(webBuilder =>
            {
                webBuilder.ConfigureServices(services =>
                {
                    services.AddDbContext<ApplicationContext>();

                    services.AddDefaultIdentity<AppUser>(options =>
                            {
                                options.User.RequireUniqueEmail = true;
                                options.SignIn.RequireConfirmedAccount = false;
                                options.SignIn.RequireConfirmedEmail = false;
                                options.SignIn.RequireConfirmedPhoneNumber = false;
                            }
                        ).AddEntityFrameworkStores<ApplicationContext>()
                        .AddDefaultTokenProviders();

                    services.AddIdentityServer()
                        .AddApiAuthorization<AppUser, ApplicationContext>();

                    services.AddAuthentication()
                        .AddIdentityServerJwt();

                    // Ref: https://github.com/dotnet/AspNetCore.Docs/issues/17517
                    services.Configure<IdentityOptions>(options =>
                    {
                        options.ClaimsIdentity.UserIdClaimType = ClaimTypes.NameIdentifier;
                        options.ClaimsIdentity.UserNameClaimType = ClaimTypes.Email;
                    });

                    services.AddControllersWithViews(options =>
                            options.Filters.Add(new HttpResponseExceptionFilter()))
                        .AddJsonOptions(options =>
                        {
                            options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
                            options.JsonSerializerOptions.IgnoreNullValues = true;
                        });

                    services.AddRazorPages();

                    services.AddSpaStaticFiles(configuration => { configuration.RootPath = "ClientApp/build"; });
                })
                .Configure(app =>
                {
                    var env = app.ApplicationServices.GetRequiredService<IWebHostEnvironment>();

                    if (env.IsDevelopment()) app.UseDeveloperExceptionPage();
                    else
                    {
                        app.UseExceptionHandler("/Error");
                        app.UseHsts();
                    }

                    app.UseHttpsRedirection();
                    app.UseStaticFiles();
                    app.UseSpaStaticFiles();

                    app.UseRouting();

                    app.UseAuthentication();

                    app.UseIdentityServer();
                    app.UseAuthorization();
                    app.UseEndpoints(endpoints =>
                    {
                        endpoints.MapDefaultControllerRoute();
                        endpoints.MapRazorPages();
                    });

                    app.UseSpa(spa =>
                    {
                        spa.Options.SourcePath = "ClientApp";
                        spa.UseProxyToSpaDevelopmentServer("http://localhost:3000");
                    });
                });
            })
            .Build()
            .Run();