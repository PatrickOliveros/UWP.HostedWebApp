using System.Collections.Generic;

namespace SignalRDemo.Classes
{
    public static class SignalRUtilities
    {
        public static int UserCounter { get; set; }
        public static List<string> OnlineUsers { get; set; }

        public static int returnUser()
        {
            return UserCounter++;
        }

        public static void AddUser(string domainUser)
        {
            //if (!OnlineUsers.Contains(domainUser))
            //{
            //    OnlineUsers.Add(domainUser);    
            //}                       
            //OnlineUsers.Add(domainUser);
        }

    }
}