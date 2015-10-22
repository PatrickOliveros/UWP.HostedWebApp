using System;
using System.Collections.Generic;
using System.Configuration;
using System.Security.Principal;
using System.Threading.Tasks;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;

namespace SignalRDemo.Classes
{
    public static class UserHandler
    {
        public static HashSet<string> ConnectedIds = new HashSet<string>();
        public static List<KeyValuePair<string, string>> ConnectedUsers = new List<KeyValuePair<string, string>>();
    }
    
    [HubName("msdev")]
    public class SignalRMSDEV : Hub
    {
        public string connectedUser { get; set; }

        public override Task OnConnected()
        {
            UserHandler.ConnectedIds.Add(Context.ConnectionId);
            return base.OnConnected();
        }

        private void UpdateUserList()
        {
            Clients.All.broadcastMessage("User Update", getCurrentUserCount()); 
        }

        private int getCurrentUserCount()
        {
            return UserHandler.ConnectedIds.Count;
        }

        public void setCurrentUser(string clientUser) {
            connectedUser = clientUser;
            UserHandler.ConnectedUsers.Add(new KeyValuePair<string, string>(Context.ConnectionId, clientUser));            
            string joinDate = DateTime.Now.ToString("F");
            Clients.Caller.joinOwnMessage();
            Clients.Others.joinMessage(connectedUser, joinDate);
            SignalRUtilities.AddUser(clientUser);
            ShowCurrentUsers();
        }

        private void ShowCurrentUsers()
        {
            string strList = string.Empty;
            bool isFirst = true;
            foreach (var x in UserHandler.ConnectedUsers) {
                strList = strList +  ((isFirst) ? x.Value : ", " + x.Value);
                isFirst = false;
            }

            Clients.All.showAllUsers(UserHandler.ConnectedIds.Count, strList);
        }

        // this has been changed. either this by time-out or gracefully. 
        public override Task OnDisconnected(bool isHandled)
        {
            UserHandler.ConnectedIds.Remove(Context.ConnectionId);
            UpdateUserList();
            return base.OnDisconnected(true);
        }

        public void Send(string name, string message)
        {
            // Call the broadcastMessage method to update clients.
            Clients.All.broadcastMessage(name, message);
            Clients.Others.toastMessage(name, message);            
        }

        public void showConnectedUser(string displayUser)
        {
            Clients.All.broadcastMessage(displayUser, "Joined the room!");
        }

        public void ToastMessage(string name, string message) {
            Clients.Others.toastMessage(name, message);
        }

        public void displayDownTime()
        {
            Clients.All.displaydowntime("System", downtimeMessage());
        }

        public void displayConfigCustomText() {
            string configText = String.Format("The value from the config file is as follows: {0}",
                ConfigurationManager.AppSettings["customMessage"]);

            Clients.All.broadcastPlainMessage(configText);
        }

        private string downtimeMessage(string configValue = "")
        {
            if (string.IsNullOrEmpty(configValue))
            {
                return string.Format("This application has a scheduled downtime on {0}. Please be guided accordingly.",
                                     DateTime.Now);
            }
            else
            {
                return string.Format("This application has a scheduled downtime on {0}. Please be guided accordingly.",
                                     configValue);
            }
        }

        public void displayDownTimeFromConfig()
        {
            Clients.All.displaydowntimefromconfig("System", 
                downtimeMessage(ConfigurationManager.AppSettings["downTime"]), 
                ConfigurationManager.AppSettings["downTime"]);            
        }

        public void registerUser()
        {
            Clients.All.broadcastMessage("System", getCurrentUser());
            Clients.All.displayUserCount(SignalRUtilities.returnUser());
            Clients.All.displayUserCount(UserHandler.ConnectedIds.Count);
        }

        public void disconnectUser()
        {
            OnDisconnected(true);
        }

        private string getCurrentUser()
        {
            return WindowsIdentity.GetCurrent().Name;
        }
    }

}