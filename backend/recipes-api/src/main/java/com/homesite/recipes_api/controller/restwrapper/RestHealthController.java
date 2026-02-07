package com.homesite.recipes_api.controller.restwrapper;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RestHealthController { // TODO Deprecate this class once GraphQL is fully adopted


  @GetMapping("/api/v1/rest-health")
  public String healthCheck() {
      return "OK";
  }
}
