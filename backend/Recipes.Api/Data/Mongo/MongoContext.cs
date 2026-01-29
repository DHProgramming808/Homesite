using Microsoft.Extensions.Options;
using MongoDB.Driver;
using Recipes.Api.Models;


namespace Recipes.Api.Data.Mongo;


public class MongoContext
{
    private readonly IMongoDatabase _database;

    public MongoContext(IOptions<MongoSettings> settings)
    {
        var mongoClient = new MongoClient(settings.Value.ConnectionString);
        _database = mongoClient.GetDatabase(settings.Value.DatabaseName);
    }

    public IMongoCollection<Recipe> Recipes => _database.GetCollection<Recipe>("Recipes");
}
