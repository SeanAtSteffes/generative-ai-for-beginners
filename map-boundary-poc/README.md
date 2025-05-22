# Map Boundary Proof of Concept

This sample demonstrates a mobile map application built with React Native and a small ASP.NET Core API backend.

## Backend

The backend stores polygon boundaries and pin locations in memory. Run it with `dotnet run`.

```bash
cd api/MapApi
dotnet run
```

## Frontend

The React Native front-end uses `react-native-maps`. Use Expo to run it:

```bash
cd frontend
npm install
npm start
```

When you tap inside a polygon, a new pin is created and sent to the backend.
