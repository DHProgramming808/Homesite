package com.homesite.recipes_api.seed;

import com.homesite.recipes_api.model.Recipe;
import com.homesite.recipes_api.repo.RecipeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.List;

@Component
public class RecipeSeeder implements CommandLineRunner {

    private final RecipeRepository repo;

    public RecipeSeeder(RecipeRepository repo) {
        this.repo = repo;
    }

    @Override
    public void run(String... args) {
        if (repo.count() > 0) return;

        Recipe r = new Recipe();
        r.setTitle("Test Recipe");
        r.setDescription("Seeded recipe for GraphQL testing");
        r.setIngredients(List.of("1 cup rice", "2 cups water", "salt"));
        r.setSteps(List.of("Rinse rice", "Boil water", "Cook 18 minutes"));
        r.setFeatured(true);
        r.setCreatedByUserId(1);
        r.setCreatedAt(Instant.now());
        r.setUpdatedAt(Instant.now());

        repo.save(r);
        System.out.println("Seeded 1 recipe");
    }
}
