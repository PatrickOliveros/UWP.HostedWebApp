using System;
using System.Web;

namespace UWP.SignalR.Classes
{
    public static class appUtilities
    {
        public static string CheckPlural(this string value, int objCount)
        {
            if (objCount > 1)
                return $"{value}s";

            return value;
        }

        public static string SanitizeString(this string value)
        {
            return value.Replace('\"', ' ').Trim();
        }

        public static void setCookieExpiration(this HttpCookie objCookie)
        {
            objCookie.Expires = DateTime.Now.AddSeconds(60);
        }
    }
}