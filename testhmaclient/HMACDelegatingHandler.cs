using System;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Cryptography;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Web;

namespace testhmaclient
{
    public class HMACDelegatingHandler : DelegatingHandler
    {
        private readonly string appId;
        private readonly string apiKey;

        public HMACDelegatingHandler(string appId, string apiKey)
        {
            this.appId = !string.IsNullOrWhiteSpace(appId) ? appId : throw new ArgumentNullException(nameof(appId));
            this.apiKey = !string.IsNullOrWhiteSpace(apiKey) ? apiKey : throw new ArgumentNullException(nameof(apiKey));

            try
            {
                Convert.FromBase64String(this.apiKey);
            }
            catch (FormatException)
            {
                throw new ArgumentException($"{nameof(apiKey)} must be a valid base64 string.");
            }
        }

        protected async override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            var requestContentBase64String = string.Empty;

            var requestUri = WebUtility.UrlEncode(request.RequestUri.AbsoluteUri.ToLower());

            var requestHttpMethod = request.Method.Method;

            // Calculate UNIX time
            var epochStart = new DateTime(1970, 01, 01, 0, 0, 0, 0, DateTimeKind.Utc);
            var timeSpan = DateTime.UtcNow - epochStart;
            var requestTimeStamp = Convert.ToUInt64(timeSpan.TotalSeconds).ToString();

            // Create the random nonce for each request
            var nonce = Guid.NewGuid().ToString("N");

            // Checking if the request contains body, usually will be null wiht HTTP GET and DELETE
            if (request.Content != null)
            {
                var content = await request.Content.ReadAsByteArrayAsync();
                var md5 = MD5.Create();

                // Hashing the request body
                var requestContentHash = md5.ComputeHash(content);
                requestContentBase64String = Convert.ToBase64String(requestContentHash);
            }

            // Creating the raw signature string
            var signatureRawData = String.Format("{0}{1}{2}{3}{4}{5}", this.appId, requestHttpMethod, requestUri, requestTimeStamp, nonce, requestContentBase64String);

            var apiKeyBytes = Convert.FromBase64String(this.apiKey);
            var signature = Encoding.UTF8.GetBytes(signatureRawData);

            using (var hmac = new HMACSHA256(apiKeyBytes))
            {
                var signatureBytes = hmac.ComputeHash(signature);
                var requestSignatureBase64String = Convert.ToBase64String(signatureBytes);

                // Setting the values in the Authorization header using custom scheme (hmacauth)
                request.Headers.Authorization = new AuthenticationHeaderValue(
                    "Hmac",
                    string.Format("{0}:{1}:{2}:{3}", this.appId, requestSignatureBase64String, nonce, requestTimeStamp));
            }

            var response = await base.SendAsync(request, cancellationToken);

            return response;
        }
    }
}