package com.homesite.recipes_api.model;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;



@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "Recipes")
public class Recipe {


  @Id
  private String id;

  private String title;
  private String description;

  private List<String> ingredients = new ArrayList<>();
  private List<String> steps = new ArrayList<>();

  private boolean featured; // TODO This should ideally be stored at the application/database level not at the object level
  private int createdByUserId;

  private Instant createdAt = Instant.now();
  private Instant updatedAt = Instant.now();

}
