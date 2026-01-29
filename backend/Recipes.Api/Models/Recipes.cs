using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Recipes.Api.Models;

public class Recipe
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    public string Title { get; set; } = null!;
    public string Description { get; set; } = null!;

    public List<string> Ingredients { get; set; } = new List<string>();
    public List<string> Steps { get; set; } = new List<string>();

    public int CreatedbyUserId { get; set; }
    public DateTime Created { get; set; } = DateTime.UtcNow;

}
