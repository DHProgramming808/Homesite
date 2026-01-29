using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Recipes.Api.Models;
using Recipes.Api.Repositories;
using System.Security.Claims;

namespace Recipes.Api.Controllers;

[ApiController]
[Route("api/v1/recipes")]
public class RecipesController : ControllerBase
{
    private readonly RecipeRepository _repository;

    public RecipesController(RecipeRepository repository)
    {
        _repository = repository;
    }


    [HttpGet]
    public async Task<ActionResult<List<Recipe>>> GetAllRecipes()
    {
        var recipes = await _repository.GetAllRecipesAsync();
        return Ok(recipes);
    }


    [HttpGet("{id}")]
    public async Task<ActionResult<Recipe>> GetRecipeById(string id)
    {
        var recipe = await _repository.GetRecipeByIdAsync(id);
        if (recipe == null)
        {
            return NotFound();
        }
        return Ok(recipe);
    }


    [Authorize]
    [HttpPost]
    public async Task<ActionResult> CreateRecipe([FromBody] Recipe recipe)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
        {
            return Unauthorized();
        }

        recipe.CreatedbyUserId = int.Parse(userIdClaim.Value);
        await _repository.CreateRecipeAsync(recipe);
        return CreatedAtAction(nameof(GetAllRecipes), new { id = recipe.Id }, recipe);
    }


    [Authorize]
    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateRecipe(string id, [FromBody] Recipe recipe)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
        {
            return Unauthorized();
        }

        // check existence + ownership
        var existingRecipe = await _repository.GetRecipeByIdAsync(id);
        if (existingRecipe == null)
        {
            return NotFound();
        }
        if (existingRecipe.CreatedbyUserId != int.Parse(userIdClaim.Value))
        {
            return Unauthorized();
        }

        recipe.CreatedbyUserId = int.Parse(userIdClaim.Value);
        await _repository.UpdateRecipeAsync(id, recipe);
        return NoContent(); // TODO consider returning the updated recipe
    }


    [Authorize(ResolveEventArgs = "Admin")]
    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateRecipeAdmin(string id, [FromBody] Recipe recipe)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
        {
            return Unauthorized();
        }

        // check existence
        var existingRecipe = await _repository.GetRecipeByIdAsync(id);
        if (existingRecipe == null)
        {
            return NotFound();
        }

        recipe.CreatedbyUserId = int.Parse(userIdClaim.Value);
        await _repository.UpdateRecipeAsync(id, recipe);
        return NoContent(); // TODO consider returning the updated recipe
    }


    [Authorize]
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteRecipe(string id)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
        {
            return Unauthorized();
        }

        // check existence + ownership
        var existingRecipe = await _repository.GetRecipeByIdAsync(id);
        if (existingRecipe == null)
        {
            return NotFound();
        }
        if (existingRecipe.CreatedbyUserId != int.Parse(userIdClaim.Value))
        {
            return Unauthorized();
        }

        await _repository.DeleteRecipeAsync(id);
        return NoContent(); // TODO consider returning some confirmation message

    }


    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteRecipeAdmin(string id)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
        {
            return Unauthorized();
        }

        await _repository.DeleteRecipeAsync(id);
        return NoContent(); // TODO consider returning some confirmation message
    }

}
