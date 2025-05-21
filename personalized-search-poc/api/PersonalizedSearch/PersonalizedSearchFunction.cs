using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Threading.Tasks;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace PersonalizedSearch
{
    public class SearchRequest
    {
        public string UserId { get; set; }
        public string Query { get; set; }
    }

    public class SearchResult
    {
        public string Id { get; set; }
        public string Content { get; set; }
    }

    public class PersonalizedSearchFunction
    {
        private readonly ILogger _logger;
        private readonly CosmosClient _cosmos;

        public PersonalizedSearchFunction(ILoggerFactory loggerFactory, CosmosClient cosmos)
        {
            _logger = loggerFactory.CreateLogger<PersonalizedSearchFunction>();
            _cosmos = cosmos;
        }

        [Function("PersonalizedSearch")]
        public async Task<HttpResponseData> Run([HttpTrigger(AuthorizationLevel.Function, "post")] HttpRequestData req)
        {
            var requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            var searchRequest = JsonConvert.DeserializeObject<SearchRequest>(requestBody);

            // Example query filtering results for the given user
            var container = _cosmos.GetContainer("SearchDb", "Documents");
            var query = new QueryDefinition("SELECT * FROM c WHERE CONTAINS(c.content, @query) AND (@userId IN c.allowedUsers)")
                .WithParameter("@query", searchRequest.Query)
                .WithParameter("@userId", searchRequest.UserId);

            var results = new List<SearchResult>();
            var iterator = container.GetItemQueryIterator<dynamic>(query);
            while (iterator.HasMoreResults)
            {
                foreach (var item in await iterator.ReadNextAsync())
                {
                    results.Add(new SearchResult { Id = item.id, Content = item.content });
                }
            }

            var response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(results);
            return response;
        }
    }
}
