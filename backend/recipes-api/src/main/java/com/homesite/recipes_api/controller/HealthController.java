package com.homesite.recipes_api.controller;

import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

@Controller
public class HealthController {

    @QueryMapping
    public String health(@Argument String healthTest) {
        return "Health test: " + (healthTest == null ? "found null in parameter" : healthTest);
    }

    @QueryMapping
    public String hello(@Argument String name) {
        return "Hello " + (name == null ? "world" : name) + "!";
    }
}
