using Yarp.ReverseProxy;
using Microsoft.AspNetCore.Builder;

var builder = WebApplication.CreateBuilder(args);


var allowedOrigins =
    builder.Configuration
        .GetSection("Cors:AllowedOrigins")
        .Get<string[]>() ?? Array.Empty<string>();

builder.Services.AddLogging();
builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy
            .WithOrigins(allowedOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

var app = builder.Build();

app.UseCors("Frontend");

app.MapMethods("{**path}", new[] { "OPTIONS" }, () => Results.Ok())
    .RequireCors("Frontend");

app.MapReverseProxy();

app.Run();
