using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Web.Bff.Api.Handlers;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddLogging(); // TODO configure logging properly and determine if this is the right place for it and method

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

builder.Services.AddAuthorization();

builder.Services.AddHttpContextAccessor();
builder.Services.AddTransient<CorrelationIdHandler>();

builder.Services.AddHttpClient("Auth", c =>
{
    var baseUrl = builder.Configuration["Services:Auth"];
    if (string.IsNullOrWhiteSpace(baseUrl))
        throw new InvalidOperationException("Services:Auth is not configured.");

    c.BaseAddress = new Uri(baseUrl);
})
.AddHttpMessageHandler<CorrelationIdHandler>();



var app = builder.Build();


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.Use(async (context, next) => // TODO move to middleware class?? // TODO verify structure
{
    const string header = "X-Correlation-ID";

    var correlationId = context.Request.Headers[header].FirstOrDefault();
    if (string.IsNullOrWhiteSpace(correlationId))
    {
        correlationId = Guid.NewGuid().ToString("N");
    }

    context.Items[header] = correlationId;
    context.Response.Headers[header] = correlationId;

    using (app.Logger.BeginScope(new Dictionary<string, object>
    {
        ["CorrelationId"] = correlationId
    }))
    {
        await next();
    }
});

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();


app.Run();
