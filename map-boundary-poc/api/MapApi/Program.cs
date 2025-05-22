using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();

var app = builder.Build();

var polygons = new List<Polygon>();
var pins = new List<Pin>();

app.MapPost("/api/polygons", (Polygon polygon) =>
{
    polygon.Id = Guid.NewGuid();
    polygons.Add(polygon);
    return Results.Created($"/api/polygons/{polygon.Id}", polygon);
});

app.MapGet("/api/polygons", () => polygons);

app.MapPost("/api/pins", (Pin pin) =>
{
    pin.Id = Guid.NewGuid();
    pins.Add(pin);
    return Results.Created($"/api/pins/{pin.Id}", pin);
});

app.MapGet("/api/pins", () => pins);

app.Run();

record Polygon
{
    public Guid Id { get; set; }
    public required string Name { get; set; }
    public required List<Coordinate> Points { get; set; }
}

record Pin
{
    public Guid Id { get; set; }
    public Guid PolygonId { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }
}

record Coordinate(double Latitude, double Longitude);
