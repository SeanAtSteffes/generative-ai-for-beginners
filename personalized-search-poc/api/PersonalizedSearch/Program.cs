using System;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Azure.Functions.Worker.Extensions.OpenApi.Extensions;
using Microsoft.Azure.Cosmos;

var host = new HostBuilder()
    .ConfigureFunctionsWorkerDefaults(builder => builder.UseNewtonsoftJson())
    .ConfigureServices(services =>
    {
        services.AddSingleton(s =>
        {
            var connection = Environment.GetEnvironmentVariable("CosmosDbConnection");
            return new CosmosClient(connection);
        });
    })
    .Build();

host.Run();
