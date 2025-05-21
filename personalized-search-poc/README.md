# Personalized Search Proof of Concept

This sample demonstrates a very simple personalized search experience using
Azure Functions with C# and a React front end. The function queries a Cosmos DB
collection and returns results filtered for the current user. The front end sends
search requests to the function and displays the returned documents.

This is only a proof of concept. You will need to configure your own Azure
resources and connection strings.

## Running the Function

1. Install [.NET 6](https://dotnet.microsoft.com/download).
2. Navigate to `api/PersonalizedSearch` and run `dotnet run` to start the function locally.

## Running the Front End

1. Install [Node.js](https://nodejs.org) and run `npm install` inside the `frontend` folder.
2. Start the dev server with `npm run dev`.
3. The React app proxies API calls to the Azure Function running on `http://localhost:7071`.
