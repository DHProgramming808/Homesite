package com.homesite.recipes_api.controller.restwrapper;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RecipesControllerRestWrapperAntiPattern {


  @GetMapping("/recipes")
    public String getRecipes() {
        return "List of recipes";
    }


}
