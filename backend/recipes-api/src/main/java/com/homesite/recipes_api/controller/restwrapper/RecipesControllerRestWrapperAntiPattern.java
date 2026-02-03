package com.homesite.recipes_api.controller.restwrapper;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/recipes")
public class RecipesControllerRestWrapperAntiPattern {


    @GetMapping("/rest-recipes")
    public String getRecipes() {
        return "List of featured/top recipes";
    }

    @GetMapping("/rest-recipe/{id}")
    public String getRecipeById(String id) {
        return "Recipe details for ID: " + id;
    }
}
