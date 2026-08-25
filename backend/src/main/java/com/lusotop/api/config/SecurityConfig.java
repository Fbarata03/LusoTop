package com.lusotop.api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Config minima desta fase: expoe apenas os GETs publicos de countries/operators/products.
 * Autenticacao real (JWT, users, roles) fica para a FASE 8 da especificacao.
 */
@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/countries/**", "/api/operators/**").permitAll()
                        .anyRequest().authenticated()
                );
        return http.build();
    }
}
