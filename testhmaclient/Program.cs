using softaware.Authentication.Hmac.Client;
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Cryptography;
using System.Threading.Tasks;

namespace testhmaclient
{
    class Program
    {
        static void SampleApiIdAndApiKey()
        {
            using (var cryptoProvider = new RNGCryptoServiceProvider())
            {
                var AppID = Guid.NewGuid();
                byte[] secretKeyByteArray = new byte[32]; //256 bit
                cryptoProvider.GetBytes(secretKeyByteArray);
                var APIKey = Convert.ToBase64String(secretKeyByteArray);
                Console.WriteLine($"AppID: {AppID}, ApiKey: {APIKey}");
            }
        }

        static async Task RunAsync()
        {
            Console.WriteLine("Calling the back-end API");

            var customDelegatingHandler = new HMACDelegatingHandler(
                "2b0d1696-3467-4c80-b624-c45d257e21da",
                "J7We5dkrkaUTFsmlUJiiao8NMoMonFXfyPfrwZM/t+Q=");
            HttpClient client = HttpClientFactory.Create(customDelegatingHandler);

            //var customDelegatingHandler = new HMACSoftAwareDelegatingHandler(
            //    "2b0d1696-3467-4c80-b624-c45d257e21da",
            //    "J7We5dkrkaUTFsmlUJiiao8NMoMonFXfyPfrwZM/t+Q=");
            //HttpClient client = HttpClientFactory.Create(customDelegatingHandler);

            //HttpClient client = new HttpClient(new ApiKeyDelegatingHandler(
            //    "2b0d1696-3467-4c80-b624-c45d257e21da",
            //    "J7We5dkrkaUTFsmlUJiiao8NMoMonFXfyPfrwZM/t+Q="));

            client.BaseAddress = new Uri("https://localhost:44394/");
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            HttpResponseMessage response = await client.GetAsync("api/orders");
            if (response.IsSuccessStatusCode)
            {
                string responseString = await response.Content.ReadAsStringAsync();
                Console.WriteLine(responseString);
            }
            Console.WriteLine("HTTP Status: {0}, Reason {1}", response.StatusCode, response.ReasonPhrase);
        }

        static async Task Example()
        {
            var apiClient = new ApiClient();

            var orders = await apiClient.GetOrders();

            foreach (var order in orders)
            {
                Console.WriteLine(order);
            }
        }

        static void Main(string[] args)
        {
            Console.WriteLine("Hello World!");
//            SampleApiIdAndApiKey();
            RunAsync().GetAwaiter().GetResult();
        }
    }
}
