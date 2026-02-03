package com.homesite.recipes_api.controller.restwrapper;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthControllerRestWrapperAntiPattern {


  @GetMapping("/health")
    public String healthCheck() {
        return "OK";
    }
}
