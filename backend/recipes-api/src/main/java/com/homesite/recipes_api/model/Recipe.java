package com.homesite.recipes_api.model;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Builder.Default;
import lombok.NoArgsConstructor;
import lombok.*;



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

  @Default
  private List<String> ingredients = new ArrayList<>();
  @Default
  private List<String> steps = new ArrayList<>();

  private boolean featured; // TODO This should ideally be stored at the application/database level not at the object level
  private int createdByUserId;

  @Default
  private Instant createdAt = Instant.now();
  @Default
  private Instant updatedAt = Instant.now();

}
