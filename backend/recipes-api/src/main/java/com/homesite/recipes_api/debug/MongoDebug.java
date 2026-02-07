package com.homesite.recipes_api.debug;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

@Component
public class MongoDebug implements CommandLineRunner {
  private final Environment env;

  public MongoDebug(Environment env) {
    this.env = env;
  }

  @Override
  public void run(String... args) {
    System.out.println("[DEBUG] SPRING_DATA_MONGODB_URI env = " + System.getenv("SPRING_DATA_MONGODB_URI"));
    System.out.println("[DEBUG] spring.data.mongodb.uri prop = " + env.getProperty("spring.data.mongodb.uri"));
    System.out.println("[DEBUG] spring.data.mongodb.host prop = " + env.getProperty("spring.data.mongodb.host"));
    System.out.println("[DEBUG] spring.data.mongodb.port prop = " + env.getProperty("spring.data.mongodb.port"));
    System.out.println("[DEBUG] spring.data.mongodb.database prop = " + env.getProperty("spring.data.mongodb.database"));
  }
}
