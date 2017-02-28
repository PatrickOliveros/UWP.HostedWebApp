using System;
using System.Collections.Generic;
using System.Web.Http;
using GenFu;
using Newtonsoft.Json;

namespace UWP.SignalR.WebAPI
{
    public class DemoApplicationController : ApiController
    {
        // GET api/<controller>
        [HttpGet]
        public IHttpActionResult Get()
        {
            var jsonResult = JsonConvert.SerializeObject(SampleData.GetUserList());

            if (jsonResult != null)
            {
                return Ok(jsonResult);
            }

            return NotFound();
        }

        [HttpGet]
        public string ApprovedRequest()
        {
            string[] activeYears = {"2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017"};
            var idxYear = new Random().Next(activeYears.Length);
            int requestNumber = new Random().Next(1, 99999);
            var dummyStatus = (new Random().Next(1,50)) % 3;

            return $"{activeYears[idxYear]}-{requestNumber.ToString().PadLeft(5, '0')}|{dummyStatus}";
        }
    }

    public static class SampleData
    {
        public static List<Person> GetUserList()
        {
            int id = 1;

            A.Configure<Person>()
                .Fill(c => c.Id, () => id++)
                .Fill(c => c.EmailAddress,
                     c => $"{c.FirstName}.{c.LastName}@some-domain.com");

            // the parameter of this function indicates the number of records that
            // genfu will create. by default, this would generate 25 records
            return A.ListOf<Person>(5);
        }
    }
}