using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Recipes.Api.Data.Mongo;
using Recipes.Api.Repositories;
using System.Text;

var builder = WebApplication.CreateBuilder(args);


builder.Services.Configure<MongoSettings>(
    builder.Configuration.GetSection("MongoSettings"));

builder.Services.AddSingleton<MongoContext>();
builder.Services.AddScoped<RecipeRepository>();

builder.services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = builder.Configuraiton["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes("temp_key_temp_key_temp_key_temp_key")) // TODO change keys and get from config
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddControllers();

// ---MySQL EF CORE---
var connString = builder.Configuration.GetConnectionString("Defaultconnection");
builder.Services.AddDbContext<AuthDbContext>(options =>
    options.UseMySql(connString, ServerVersion.AutoDetect(connString)));


builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();


app.Run();
