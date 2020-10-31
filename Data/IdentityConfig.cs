using IdentityServer4.Models;
using IdentityServer4.Test;
using System.Collections.Generic;

namespace Reminder.Data
{
    public static class IdentityConfig
    {
        public static List<TestUser> GetUsers() => new List<TestUser>()
        {
            new TestUser
            {
                SubjectId = "1",
                Username = "JohnDoe",
                Password = "password"
            }
        };

        public static List<Client> GetClients() => new List<Client>
        {
            new Client
            {
                ClientName = "Postman",
                ClientId = "Postman",
                AllowedGrantTypes = GrantTypes.ClientCredentials,

                ClientSecrets =
                {
                    new Secret("secret".Sha256())
                },

                AllowedScopes = new[]
                {
                    "ReminderAPI"
                },
                AllowOfflineAccess = true
            }
        };
    }
}