using MongoDB.Driver;
using Recipes.Api.Data.Mongo;
using Recipes.Api.Models;

namespace Recipes.Api.Respositories;
public class RecipeRepository
{
    private readonly IMongoCollection<Recipe> _recipes;

    public RecipeRepository(MongoContext context)
    {
        _recipes = context.Recipes;
    }

    public async Task<List<Recipe>> GetAllRecipesAsync()
    {
        return await _recipes.Find(_ => true).ToListAsync();
    }

    public async Task<Recipe?> GetRecipeByIdAsync(string id)
    {
        return await _recipes.Find(r => r.Id == id).FirstOrDefaultAsync();
    }

    public async Task CreateRecipeAsync(Recipe recipe)
    {
        await _recipes.InsertOneAsync(recipe);
    }

    public async Task UpdateRecipeAsync(string id, Recipe updatedRecipe) //TODO check ownership
    {
        await _recipes.ReplaceOneAsync(r => r.Id == id, updatedRecipe);
    }

    public async Task DeleteRecipeAsync(string id)
    {
        await _recipes.DeleteOneAsync(r => r.Id == id);
    }
}
