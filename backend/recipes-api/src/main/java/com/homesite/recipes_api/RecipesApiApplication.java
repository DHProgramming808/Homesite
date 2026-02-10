package com.homesite.recipes_api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationEnvironmentPreparedEvent;

import com.homesite.recipes_api.config.AppConfig;
import com.mongodb.client.MongoClient;

@SpringBootApplication
public class RecipesApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(RecipesApiApplication.class, args);


    System.out.println("[EARLY] ENV SPRING_DATA_MONGODB_URI=" + System.getenv("SPRING_DATA_MONGODB_URI"));

    SpringApplication app = new SpringApplication(RecipesApiApplication.class);

    // Resolved Spring properties (available BEFORE beans initialize)
    app.addListeners((ApplicationEnvironmentPreparedEvent event) -> {
      var env = event.getEnvironment();
      System.out.println("[EARLY] prop spring.data.mongodb.uri=" + env.getProperty("spring.data.mongodb.uri"));
      System.out.println("[EARLY] prop spring.data.mongodb.host=" + env.getProperty("spring.data.mongodb.host"));
      System.out.println("[EARLY] prop spring.data.mongodb.port=" + env.getProperty("spring.data.mongodb.port"));
      System.out.println("[EARLY] prop spring.data.mongodb.database=" + env.getProperty("spring.data.mongodb.database"));
    });



    System.out.println("Recipes API started successfully.");
	}

}
