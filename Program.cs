using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace SohbetServer
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateWebHostBuilder(args).Build().Run();
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args){
           // var port = Environment.GetEnvironmentVariable("PORT");

            return WebHost.CreateDefaultBuilder(args)
                .ConfigureKestrel((context, serverOptions) =>
                {
                     serverOptions.Listen(IPAddress.Any, 5000);
                     serverOptions.Listen(IPAddress.Any, 5001, listenOptions =>
                     {
                         listenOptions.UseHttps();
                         listenOptions.UseHttps("wwwroot/certs/ca.pfx", "1234");
                     });
                    })
                 .UseStartup<Startup>()
                // .UseUrls("http://*:" + port);
        }
    }
}
