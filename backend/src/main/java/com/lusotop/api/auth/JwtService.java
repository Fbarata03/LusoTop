package com.lusotop.api.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.Optional;

@Service
public class JwtService {

    private final SecretKey key;
    private final long expirationDays;
    private final long adminExpirationHours;

    public JwtService(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.expiration-days:7}") long expirationDays,
            @Value("${app.jwt.admin-expiration-hours:12}") long adminExpirationHours
    ) {
        // Keys.hmacShaKeyFor rejeita chaves com menos de 256 bits (WeakKeyException) -- garante
        // que um JWT_SECRET fraco nao passa despercebido, falhando o arranque da app.
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationDays = expirationDays;
        this.adminExpirationHours = adminExpirationHours;
    }

    public String generateToken(Long userId, String email, String role) {
        Instant now = Instant.now();
        // Tokens de ADMIN expiram muito mais depressa: a conta admin pode enviar recargas sem
        // pagar, por isso limita-se o tempo que um token roubado continua valido.
        Instant expiry = "ADMIN".equals(role)
                ? now.plus(adminExpirationHours, ChronoUnit.HOURS)
                : now.plus(expirationDays, ChronoUnit.DAYS);
        return Jwts.builder()
                .subject(email)
                .claim("userId", userId)
                .claim("role", role)
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiry))
                .signWith(key)
                .compact();
    }

    public Optional<Claims> parse(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
            return Optional.of(claims);
        } catch (JwtException | IllegalArgumentException e) {
            return Optional.empty();
        }
    }
}
