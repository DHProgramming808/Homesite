package com.homesite.recipes_api.model;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


@Document(collection = "Recipes")
public class Recipe {


  @Id
  private String id;

  private String title;
  private String description;

  private List<String> ingredients = new ArrayList<>();
  private List<String> steps = new ArrayList<>();

  private Instant createdAt = Instant.now();

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public void setTitle(String title) {
    this.title = title;
  }
}
