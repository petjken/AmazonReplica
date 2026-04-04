using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using AmazonReplica.API.Data;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
});
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddDbContext<AmazonDbContext>(options => options.UseSqlite(builder.Configuration.GetConnectionString("AmazonConnection")));

builder.Services.AddCors(options =>
    options.AddPolicy("AllowReactAppBlah", policy =>
    {
        policy
            .SetIsOriginAllowed(static origin =>
            {
                if (string.IsNullOrEmpty(origin))
                    return false;
                if (origin is "http://localhost:3000" or "https://localhost:3000" or "http://127.0.0.1:3000")
                    return true;
                if (Uri.TryCreate(origin, UriKind.Absolute, out var uri) &&
                    uri.Host.EndsWith(".azurestaticapps.net", StringComparison.OrdinalIgnoreCase))
                    return true;
                return false;
            })
            .AllowAnyMethod()
            .AllowAnyHeader();
    }));


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("AllowReactAppBlah");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
