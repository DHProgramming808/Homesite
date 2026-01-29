using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Web.Bff.Api.Handlers;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddLogging(); // TODO configure logging properly and determine if this is the right place for it and method

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes("temp_key_temp_key_temp_key_temp_key")) // TODO change keys and get from config
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddHttpContextAccessor();
builder.Services.AddTransient<CorrelationIdHandler>();

builder.Services.AddHttpClient("Auth", c =>
{
    c.BaseAddress = new Uri("http://localhost:5000/"); //TODO get from config
})
.AddHttpMessageHandler<CorrelationIdHandler>(); // TODO verify if we need the handler here as well
builder.Services.AddHttpClient("Recipes", c =>
{
    c.BaseAddress = new Uri("http://localhost:6000/"); //TODO get from config
}); // TODO check if we also need a correlation handler here





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
