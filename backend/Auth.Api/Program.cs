using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.EntityFrameworkCore;

using Auth.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// -- Bind Configurations --
builder.Services.Configure<JwtOptions>(
    builder.Configuration.GetSection("Jwt"));
builder.Services.Configure<CorsOptions>(
    builder.Configuration.GetSection("Cors"));

// ---CORS Setup---
var cors = builder.Configuration.GetSection("Cors").Get<CorsOptions>() ?? new CorsOptions();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(cors.AllowedOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// ---JWT Authentication Setup ---
var jwt = builder.Configuration.GetSection("Jwt").Get<JwtOptions>() ?? new JwtOptions();

if (string.IsNullOrEmpty(jwt.Key) || jwt.Key.Length < 16)
{
    throw new InvalidOperationException("JWT Signing Key is not configured.");
}

var key = Encoding.UTF8.GetBytes(jwt.Key); // TODO change keys
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = jwt.RequireHttpsMetadata; // TODO change for higher environments
    options.SaveToken = true;

    options.TokenValidationParameters = new TokenValidationParameters //TODO
    {
        ValidateIssuer = false,
        ValidIssuer = jwt.Issuer,

        ValidateAudience = false,
        ValidAudience = jwt.Audience,

        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),

        ValidateLifetime = true,
        ClockSkew = TimeSpan.FromMinutes(2)
    };
});

//Authorization

builder.Services.AddScoped<JwtTokenService>();
builder.Services.AddAuthorization();

// ---End Section ---

// ---MySQL EF CORE---
var connString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AuthDbContext>(options =>
    options.UseMySql(connString, ServerVersion.AutoDetect(connString)));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddHealthChecks();

var app = builder.Build();

// Configure middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHealthChecks("/health");


app.Run();
