package com.homesite.recipes_api.controller.restwrapper;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class RestHealthController {
  @GetMapping({"/health", "/api/v1/rest-health"})
  public String healthCheck() {
      return "OK";
  }
}
