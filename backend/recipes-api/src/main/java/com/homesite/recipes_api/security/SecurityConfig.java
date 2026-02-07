package com.homesite.recipes_api.security;

import java.nio.charset.StandardCharsets;

import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.web.SecurityFilterChain;


@Configuration
@EnableMethodSecurity
public class SecurityConfig {

  @Value("${jwt.secret}")
  private String jwtSecret;

  @Value("${jwt.audience}")
  private String jwtAudience;

  @Value("${jwt.issuer}")
  private String jwtIssuer;

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
              .requestMatchers("/graphql").permitAll()
              .requestMatchers("/graphiql").permitAll()
                .anyRequest().authenticated()
            )
            .authorizeHttpRequests(auth -> auth
              .requestMatchers("/health").permitAll()
                .anyRequest().permitAll() //TODO ensure this is the correct pattern for allowing unauthenticated access to actuator endpoints without opening up other APIs
            )
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt
                    .decoder(jwtDecoder())
                )
            );

        return http.build();
    }


    @Bean
    public JwtDecoder jwtDecoder() {
      var secretKey = new SecretKeySpec(jwtSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
      NimbusJwtDecoder jwtDecoder =  NimbusJwtDecoder.withSecretKey(secretKey).build();

      // TODO setup validators for issuer and audience
      /*
      OAuth2TokenValidator<Jwt> jwtValidator = JwtValidators.createDefault();
      if (jwtIssuer != null && !jwtIssuer.isEmpty()) {
        OAuth2TokenValidator<Jwt> issuerValidator = JwtValidators.createDefaultWithIssuer(jwtIssuer);

        if (jwtAudience != null && !jwtAudience.isEmpty()) {
          AudienceValidator audienceValidator = new AudienceValidator(jwtAudience);
          jwtDecoder.setJwtValidator(new DelegatingOAuth2TokenValidator<>(issuerValidator, audienceValidator));
        } else {
          jwtDecoder.setJwtValidator(issuerValidator);
        }
      } else {
        jwtDecoder.setJwtValidator(jwtValidator);
      }
      */

      return jwtDecoder;
    }

    // TODO implement audience validator
    /*
    static class AudienceValidator implements OAuth2TokenValidator<Jwt> {
        private final String audience;

        AudienceValidator(String audience) { this.audience = audience; }

        @Override
        public OAuth2TokenValidatorResult validate(Jwt jwt) {
            if (jwt.getAudience() != null && jwt.getAudience().contains(audience)) {
                return OAuth2TokenValidatorResult.success();
            }
            var error = new OAuth2Error("invalid_token", "Missing or invalid audience", null);
            return OAuth2TokenValidatorResult.failure(error);
        }
    }
        */
}
