using System.IO;
using System.Web;
using System.Web.Http;

namespace UWP.SignalR.WebAPI
{
    public class FileUploadController : ApiController
    {
        [HttpPost]
        public void UploadFiles()
        {
            var uploadPath = System.Web.Hosting.HostingEnvironment.MapPath("~/Content/Uploaded/");

            HttpFileCollection hfc = System.Web.HttpContext.Current.Request.Files;

            HttpPostedFile hpf = hfc[0];

            if (hpf.ContentLength > 0)
            {
                if (!File.Exists($"{uploadPath}{Path.GetFileName(hpf.FileName)}"))
                {
                    hpf.SaveAs($"{uploadPath}{Path.GetFileName(hpf.FileName)}");
                }
            }
        }

        [HttpGet]
        public string CheckService()
        {
            return "I am invoked!";
        }
    }
}
