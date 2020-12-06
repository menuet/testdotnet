using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace testhmaclient
{
    class ApiClient
    {
        HttpClient client = new HttpClient();
        public ApiClient()
        {
            client.BaseAddress = new Uri("https://localhost:44394/");
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(
                new MediaTypeWithQualityHeaderValue("application/json"));
        }

        public async Task<List<Order>> GetOrders()
        {
            HttpResponseMessage response = await client.GetAsync("api/orders");
            response.EnsureSuccessStatusCode();
            var orders = await response.Content.ReadAsAsync<List<Order>>();
            return orders;
        }
    }
}
