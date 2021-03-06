﻿using System;
using Microsoft.Extensions.Logging;

public static class Utils
{
#nullable enable
    public static void CheckIfBelongToCurrentUser(
        AppUser? userToCompare,
        AppUser currentUser,
        ILogger<GenericController>? logger,
        string actionMessage = "access resource")
    {
        if (userToCompare != currentUser)
        {
            logger?.LogInformation(
                $"User [{currentUser.Id}] tries to {actionMessage}, " +
                $"which belongs to user [{userToCompare?.Id}].");
            throw new HttpResponseException($"You cannot {actionMessage}", 403);
        }
    }

    public static long? DateTimeToUnixTime(DateTime? time)
    {
        if (time is null) return null;
        TimeSpan? timeSpan = time - new DateTime(1970, 1, 1, 0, 0, 0);
        return (long)timeSpan.GetValueOrDefault().TotalMilliseconds;
    }

    public static DateTime? UnixTimeToDateTime(long? unixTime)
    {
        if (unixTime is null) return null;
        DateTime localTime = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);
        return localTime.AddMilliseconds((double)unixTime).ToLocalTime();
    }
#nullable disable
}