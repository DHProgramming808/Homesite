package com.homesite.recipes_api.model;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "Recipes")
public class Recipe {


  @Id
  private String id;

  private String title;
  private String description;

  private List<String> ingredients = new ArrayList<>();
  private List<String> steps = new ArrayList<>();

  private Instant createdAt = Instant.now();
  private Instant updatedAt = Instant.now();

}
