using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Principal;
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using Microsoft.Azure;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;

namespace UWP.SignalR.Classes
{
    public static class UserHandler
    {
        public static List<KeyValuePair<string, string>> ConnectedUsers = new List<KeyValuePair<string, string>>();
    }
    
    [HubName("signalrwin10")]
    public class applicationSignalRController : Hub
    {
        public string connectedUser { get; set; }

        private void UpdateUserList()
        {
            Clients.All.broadcastMessage("User Update", getCurrentUserCount()); 
        }

        public void setCurrentUser(string clientUser) {
            connectedUser = (string.IsNullOrWhiteSpace(clientUser)) ? getCurrentUser() : clientUser;

            // Allow duplicates as the same user might have connected to another device or window.
            UserHandler.ConnectedUsers.Add(new KeyValuePair<string, string>(Context.ConnectionId, connectedUser));

            int existingConnections = 0;

            if (CheckUserExists(connectedUser, out existingConnections) && existingConnections > 1)
            {
                Clients.Caller.joinExistingConnections(existingConnections);
            }
            else
            {
                Clients.Caller.joinOwnMessage();
                Clients.Others.joinMessage(connectedUser, DateTime.Now.ToString("F"));
                ShowCurrentUsers();
            }
        }

        public void broadcastAllToasts()
        {
            HttpClient cons = new HttpClient {BaseAddress = new Uri(GetApplicationPath())};
            cons.DefaultRequestHeaders.Accept.Clear();
            var objResult = string.Empty;

            objResult = ProcessRequest(cons);
            // Santize results, probably due to forcing a synchronous result from the Web API call
            objResult = objResult.SanitizeString();

            string[] itemResult = objResult.Split('|');


            Clients.All.broadcastToasts( $"Request - {itemResult[0]}", itemResult[0], itemResult[1]);
        }

        private string ProcessRequest(HttpClient cons)
        {
            var strResult = string.Empty;
            using (cons)
            {
                HttpResponseMessage res = cons.GetAsync("api/DemoApplication/ApprovedRequest").Result;
                res.EnsureSuccessStatusCode();
                if (res.IsSuccessStatusCode)
                {
                    strResult = res.Content.ReadAsStringAsync().Result;
                }
            }

            return strResult;
        }

        public void showDefaultMessage(int messageType)
        {
            Clients.All.displayCustomMessage(messageType);
        }

        private void ShowCurrentUsers()
        {
            var lstConnectedUsers = string.Empty;
            var lstConnectedIds = string.Empty;

            if (UserHandler.ConnectedUsers.Any())
            {
                lstConnectedUsers = string.Join(", ", UserHandler.ConnectedUsers.ToArray()
                    .Select(cu => cu.Value).Distinct());
                lstConnectedIds = string.Join(", ", UserHandler.ConnectedUsers.ToArray()
                    .Select(ci => ci.Key));
            }

            var uniqueUsers = UserHandler.ConnectedUsers.Select(uu => uu.Value).Distinct().Count();

            Clients.All.showAllUsers(uniqueUsers, lstConnectedUsers);

            // Enumerate existing connectionIds
            //Clients.All.showAllUsers(UserHandler.ConnectedIds.Count, lstConnectedIds);
        }

        public void Send(string name, string message)
        {
            // Call the broadcastMessage method to update clients.
            Clients.All.broadcastMessage(name, message);
        }

        public void showConnectedUser(string displayUser)
        {
            Clients.All.broadcastMessage(displayUser, "Joined the room!");
        }

        public void clickedUser(string clickedUser)
        {
            Clients.All.broadcastMessage("System", $"{clickedUser} clicked the notification!");
            // Todo: Since we were able to get the user who clicked the notification, we can perform operations related to this object
        }

        public void broadcastPhoto(string photoUrl, string userSharer)
        {
            Clients.All.broadcastPhoto(photoUrl, userSharer);
        }

        public void broadcastContactToast(string conSharer, string conName, string conInfo, string conType)
        {
            Clients.Others.broadcastContactInformation(conSharer, conName, conInfo, conType);
        }

        public void broadcastDefaultToast()
        {
            Clients.All.broadcastDefault();
        }

        public void broadcastTextYesNoToast()
        {
            Clients.All.broadcastTextYesNo();
        }

        public void broadcastSelectionToast()
        {
            Clients.All.broadcastSelection();
        }
        public void broadcastSelectionJsonToast()
        {
            Clients.All.broadcastSelectionJson();
        }

        public void broadcastPhotoToast(string userSharer)
        {
            Clients.All.broadcastPhotoT(userSharer);
        }

        #region Photo Handlers
        public void fileUpload(string localFilePath, string userName)
        {
            var objFile = new FileInfo(localFilePath);
            var renamedFile = Guid.NewGuid().ToString().Substring(0, 5);
            var movedFile = Path.Combine(objFile.Directory.ToString(), $"{renamedFile}{objFile.Extension}");

            File.Move(localFilePath, movedFile);

            var apiPath = GetApplicationPath() + "api/FileUpload";

            string fileName = Path.GetFileName(movedFile);

            using (WebClient client = new WebClient())
            {
                client.UploadFile(new Uri(apiPath), movedFile);
            }

            broadcastPhoto(fileName, userName);
        }

        public void azureUpload(string localFilePath, string userName)
        {
            // Todo: signalr doesn't seem to work with functions with optional parameters.

            var uploadFilePath = localFilePath;

            CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
                CloudConfigurationManager.GetSetting("StorageConnectionString"));

            // Create the blob client.
            CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

            // Retrieve a reference to a container.
            CloudBlobContainer container = blobClient.GetContainerReference("mycontainer");

            // Create the container if it doesn't already exist.
            container.CreateIfNotExists();
            container.SetPermissions(
                new BlobContainerPermissions { PublicAccess = BlobContainerPublicAccessType.Blob });

            CloudBlockBlob blockBlob = container.GetBlockBlobReference("myblob");

            // Create or overwrite the "myblob" blob with contents from a local file.
            using (var fileStream = File.OpenRead(uploadFilePath))
            {
                blockBlob.UploadFromStream(fileStream);
            }

            broadcastPhoto(blockBlob.Uri.AbsoluteUri, userName);
        }
        #endregion

        #region User/Connection Management
        public override Task OnConnected()
        {
            //CheckCookie("");
            return base.OnConnected();
        }

        private void CheckCookie(string userName)
        {
            HttpCookie usrCookie = HttpContext.Current.Request.Cookies["currentUser"];

            if (usrCookie != null && usrCookie.Value != userName)
            {
                usrCookie = new HttpCookie("currentUser", userName);
            }

            if (usrCookie == null || usrCookie.Value == "")
            {
                usrCookie = new HttpCookie("currentUser", userName);

                HttpContext.Current.Response.Cookies.Add(usrCookie);
            }
        }

        private List<KeyValuePair<string, string>> FindUserByName(string userName)
        {
            return UserHandler.ConnectedUsers.FindAll(x => x.Value == userName);
        }

        public override Task OnDisconnected(bool isHandled)
        {
            // Todo: If the user has multiple connections, do not call the update user list. 

            var disconnectedUser =
                UserHandler.ConnectedUsers.FindAll(x => x.Key == Context.ConnectionId).Select(x => x.Value).SingleOrDefault();

            UserHandler.ConnectedUsers.RemoveAll(x => x.Key == Context.ConnectionId);

            if (FindUserByName(disconnectedUser).Count < 1)
            {
                Clients.Others.leftMessage(disconnectedUser, DateTime.Now.ToString("F"));
                UpdateUserList();
            }

            return base.OnDisconnected(true);
        }

        private int getCurrentUserCount()
        {
            return UserHandler.ConnectedUsers.ToArray().Select(cu => cu.Value).Distinct().Count();
        }

        private string getCurrentUser()
        {
            return WindowsIdentity.GetCurrent().Name;
        }

        private bool CheckUserExists(string userName, out int userConnections)
        {
            userConnections = FindUserByName(userName).Count();

            return (userConnections > 0);
        }

        #endregion

        private string GetApplicationPath()
        {
            return $"{HttpContext.Current.Request.Url.Scheme}://{HttpContext.Current.Request.Url.Authority}/";
        }
    }

}