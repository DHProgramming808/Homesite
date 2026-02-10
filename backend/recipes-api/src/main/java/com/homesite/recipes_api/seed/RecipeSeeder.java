package com.homesite.recipes_api.seed;

import java.time.Instant;
import java.util.List;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import com.homesite.recipes_api.model.Recipe;
import com.homesite.recipes_api.repo.RecipeRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class RecipeSeeder implements ApplicationRunner {

    private final RecipeRepository recipeRepository;

    @Override
    public void run(ApplicationArguments args) {
        long count = recipeRepository.count();

        if (count > 0) {
            log.info("[Seeder] Recipes already exist (count={}), skipping seed", count);
            return;
        }

        log.info("[Seeder] No recipes found, seeding initial data…");

        Recipe recipe = Recipe.builder()
                .title("Spicy Garlic Noodles")
                .description("Chewy noodles tossed in a spicy-sweet garlic sauce.")
                .ingredients(List.of(
                        "8 oz noodles",
                        "4 cloves garlic, minced",
                        "2 tbsp soy sauce",
                        "1 tbsp oyster sauce",
                        "1 tbsp brown sugar",
                        "1 tsp chili flakes",
                        "2 tbsp neutral oil",
                        "2 scallions, sliced"
                ))
                .steps(List.of(
                        "Cook noodles until just tender; drain.",
                        "Heat oil; sauté garlic 30–45 seconds.",
                        "Add soy sauce, oyster sauce, brown sugar, chili flakes; stir.",
                        "Toss noodles in sauce until coated.",
                        "Top with scallions and serve."
                ))
                .featured(true)
                .createdByUserId(1)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .imageUrl("https://example.com/spicy-garlic-noodles.jpg") // Placeholder image URL
                .build();

        recipeRepository.save(recipe);

        log.info("[Seeder] Seeded initial recipe with id={}", recipe.getId());
    }
}
