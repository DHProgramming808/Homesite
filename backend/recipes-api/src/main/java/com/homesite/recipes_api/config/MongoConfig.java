
package com.homesite.recipes_api.config;

import com.mongodb.ConnectionString;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

@Configuration
public class MongoConfig {

  @Bean
  public MongoClient mongoClient(Environment env) {
    // This is the single source of truth. If this prints correctly, the client MUST use it.
    String uri = env.getProperty("spring.data.mongodb.uri");
    if (uri == null || uri.isBlank()) {
      throw new IllegalStateException("spring.data.mongodb.uri is null/blank at MongoClient bean creation time");
    }

    System.out.println("[Manual MongoClient] using uri = " + uri);

    // Force the driver to use exactly this connection string
    return MongoClients.create(new ConnectionString(uri));
  }
}
