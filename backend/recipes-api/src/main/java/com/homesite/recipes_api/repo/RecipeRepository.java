package com.homesite.recipes_api.repo;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.homesite.recipes_api.model.Recipe;


public interface RecipeRepository extends MongoRepository<Recipe, String> {

    List<Recipe> findByFeaturedTrue();

}
