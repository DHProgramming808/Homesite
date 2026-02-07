package com.homesite.recipes_api.controller;

import com.homesite.recipes_api.model.Recipe;
import com.homesite.recipes_api.repo.RecipeRepository;

import lombok.Data;
import org.springframework.graphql.data.method.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping; //TODO Remove as we aren't using REST here

import java.time.Instant;
import java.util.List;


@Controller
public class RecipesController {

  private static final String USER_ID_CLAIM = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";

  private final RecipeRepository repo;


  public RecipesController(RecipeRepository repo) {
    this.repo = repo;
  }


  // TODO gracefully handle errors/exceptions in all methods

  @QueryMapping
  public List<Recipe> getFeaturedRecipes(@Argument Integer limit) {
    var all = repo.findByFeaturedTrue();
    int take = (limit == null || limit <=0) ? 8 : Math.min(limit, 50);
    return all.stream().limit(take).toList();

    // TODO Implement pagination properly later
    // TODO pull featured recipes ID from a separate collection/table instead of filtering here
  }


  @QueryMapping
  public Recipe getRecipeById(@Argument String id) {
    return repo.findById(id).orElse(null);
  }


  // Auth layer
  @MutationMapping
  @PreAuthorize("isAuthenticated()")
  public Recipe createRecipe(@Argument CreateRecipeInput input, JwtAuthenticationToken auth) {
    int userId = Integer.parseInt(auth.getToken().getClaimAsString(USER_ID_CLAIM)); // TODO handle potential parsing errors TODO figure out auth jwt vs oauth


    var now = Instant.now();

    //check if any required fields are missing
    if (input.title == null || input.description == null || input.ingredients == null || input.steps == null) {
      throw new RuntimeException("Missing required fields");
    }

    Recipe recipe = Recipe.builder()
            .title(input.getTitle())
            .description(input.getDescription())
            .ingredients(input.getIngredients())
            .steps(input.steps)
            .featured(input.featured != null && input.featured) // New recipes are not featured by default
            .createdByUserId(userId)
            .createdAt(now)
            .updatedAt(now)
            .build();

    return repo.save(recipe);
  }


  @MutationMapping
  @PreAuthorize("isAuthenticated()")
  public Recipe updateRecipe(@Argument String id, @Argument UpdateRecipeInput input, JwtAuthenticationToken auth) {
    int userId = Integer.parseInt(auth.getToken().getClaimAsString(USER_ID_CLAIM)); // TODO handle potential parsing errors TODO figure out auth jwt vs oauth

    Recipe recipe = repo.findById(id).orElseThrow(() -> new RuntimeException("Recipe not found"));

    if (recipe.getCreatedByUserId() != userId) {
      throw new RuntimeException("Unauthorized to update this recipe");
    }

    if (input.title != null) {
      recipe.setTitle(input.title);
    }
    if (input.description != null) {
      recipe.setDescription(input.description);
    }
    if (input.ingredients != null) {
      recipe.setIngredients(input.ingredients);
    }
    if (input.steps != null) {
      recipe.setSteps(input.steps);
    }
    if (input.featured != null) {
      recipe.setFeatured(input.featured);
    }

    //check if all fields are null or empty
    if (input.title == null && input.description == null && input.ingredients == null && input.steps == null && input.featured == null) {
      throw new RuntimeException("No fields to update");
    }

    recipe.setUpdatedAt(Instant.now());


    return repo.save(recipe);
  }


  @MutationMapping
  @PreAuthorize("isAuthenticated()") // TODO also add Admin delete capability
  public Boolean deleteRecipe(@Argument String id, JwtAuthenticationToken auth) {
    int userId = Integer.parseInt(auth.getToken().getClaimAsString(USER_ID_CLAIM));

    Recipe recipe = repo.findById(id).orElseThrow(() -> new RuntimeException("Recipe not found"));
    if (recipe.getCreatedByUserId() != userId) {
      throw new RuntimeException("Unauthorized to delete this recipe");
    }

    repo.deleteById(id);
    return true;
  }


  //Inputs
  // TODO move to DTO files
  @Data
  public static class CreateRecipeInput {
    public String title;
    public String description;
    public List<String> ingredients;
    public List<String> steps;
    public Boolean featured;
  }


  @Data
  public static class UpdateRecipeInput {
    public String id;
    public String title;
    public String description;
    public List<String> ingredients;
    public List<String> steps;
    public Boolean featured;
  }
}
