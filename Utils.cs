using System;

namespace Reminder
{
    public static class Utils
    {
        public static long? DateTimeToUnixTime(DateTime? time)
        {
            if (time == null) return null;
            TimeSpan? timeSpan = time - new DateTime(1970, 1, 1, 0, 0, 0);
            return (long) timeSpan.GetValueOrDefault().TotalMilliseconds;
        }

        public static DateTime? UnixTimeToDateTime(long? unixTime)
        {
            if (unixTime == null) return null;
            DateTime localTime = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);
            return localTime.AddMilliseconds((double) unixTime).ToLocalTime();
        }
    }
}