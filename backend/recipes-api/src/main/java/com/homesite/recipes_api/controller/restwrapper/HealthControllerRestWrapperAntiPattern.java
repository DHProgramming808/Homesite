package com.homesite.recipes_api.controller.restwrapper;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthControllerRestWrapperAntiPattern {


  @GetMapping("/rest-health")
    public String healthCheck() {
        return "OK";
    }

  @GetMapping("/rest-graphql-health")
    public String graphqlHealthCheck() {
        return "GraphQL OK";
    }
}
