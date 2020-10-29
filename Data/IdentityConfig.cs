using IdentityServer4;
using IdentityServer4.Models;
using IdentityServer4.Test;
using System.Collections.Generic;
using System.Security.Claims;

namespace Reminder.Data
{
    public static class IdentityConfig
    {
        public static List<TestUser> GetUsers()
        {
            return new List<TestUser>
            {
                new TestUser
                {
                    SubjectId = "fec0a4d6-5830-4eb8-8024-272bd5d6d2bb",
                    Username = "Organizer",
                    Password = "password",
                    Claims = new List<Claim>
                    {
                        new Claim("given_name", "Jon"),
                        new Claim("family_name", "Doe"),
                        // new Claim("role", "Administrator"),
                    }
                }
            };
        }

        public static List<IdentityResource> GetIdentityResources()
        {
            return new List<IdentityResource>
            {
                new IdentityResources.OpenId(),
                new IdentityResources.Profile(),
                new IdentityResources.Email(),
            };
        }

        internal static IEnumerable<ApiResource> GetApiResources()
        {
            return new[]
            {
                new ApiResource("reminderapi", "Reminder API", new[] {"role"})
            };
        }

        public static List<Client> GetClients()
        {
            return new List<Client>
            {
                new Client
                {
                    ClientName = "Postman",
                    AllowOfflineAccess = true,
                    ClientId = "832afa32-cabe-40a0-8909-2241cd85e47d",
                    AllowedGrantTypes = new[]
                    {
                        GrantType.ResourceOwnerPassword
                    },
                    // AllowAccessTokensViaBrowser = true,
                    Enabled = true,
                    RedirectUris = new[]
                    {
                        "https://www.getpostman.com/oauth2/callback"
                    },
                    PostLogoutRedirectUris = new[]
                    {
                        "https://localhost:5001/signout-callback-oidc"
                    },
                    AllowedScopes = new[]
                    {
                        IdentityServerConstants.StandardScopes.OpenId,
                        IdentityServerConstants.StandardScopes.Profile,
                        "roles",
                        "reminderapi",
                    },
                    ClientSecrets = new[]
                    {
                        new Secret("NotASecret".Sha256()),
                    },
                    ClientUri = null
                }
            };
        }
    }
}