using Microsoft.Owin;
using Owin;
using UWP.SignalR;

[assembly: OwinStartup(typeof(Startup))]

namespace UWP.SignalR
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            // For more information on how to configure your application, visit http://go.microsoft.com/fwlink/?LinkID=316888
            app.MapSignalR();
        }
    }
}