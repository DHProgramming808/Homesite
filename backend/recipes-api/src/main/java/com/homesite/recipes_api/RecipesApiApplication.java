package com.homesite.recipes_api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class RecipesApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(RecipesApiApplication.class, args);

    System.out.println("Recipes API started successfully.");
	}

}
