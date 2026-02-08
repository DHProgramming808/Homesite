package com.homesite.recipes_api.config;

import com.mongodb.client.MongoClient;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.context.annotation.Bean;
import org.springframework.core.env.Environment;


public class AppConfig {

  private final Environment env;

  public AppConfig(Environment env) {
    this.env = env;
  }

  /*
  @Bean
  public MongoClient mongoClient() {
    MongoClient mongoRecipesDb = com.mongodb.client.MongoClients.create(env.getProperty("spring.data.mongodb.uri"));
    return mongoRecipesDb;
  }

  @Bean
  public MongoTemplate mongoTemplate() {
    return new MongoTemplate(mongoClient(), env.getProperty("recipesDb"));
  }
  */
}
