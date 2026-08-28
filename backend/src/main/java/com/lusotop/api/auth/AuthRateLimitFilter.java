package com.lusotop.api.auth;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Limita tentativas de login/registo por IP -- sem isto, um atacante pode tentar passwords
 * indefinidamente (forca bruta) ou criar contas em massa. So single-instance (contador em
 * memoria); o Render corre este servico numa unica instancia, por isso nao precisa de um store
 * partilhado (ex: Redis).
 */
@Component
public class AuthRateLimitFilter extends OncePerRequestFilter {

    private static final int MAX_ATTEMPTS = 10;
    private static final long WINDOW_MILLIS = 5 * 60 * 1000;

    private record Window(long startMillis, AtomicInteger count) {
    }

    private final Map<String, Window> attemptsByIp = new ConcurrentHashMap<>();

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        String path = request.getRequestURI();
        boolean limited = "/api/auth/login".equals(path) || "/api/auth/register".equals(path);

        if (limited && "POST".equalsIgnoreCase(request.getMethod()) && isRateLimited(clientIp(request))) {
            response.setStatus(429);
            response.setContentType("application/json");
            response.getWriter().write("{\"code\":\"TOO_MANY_ATTEMPTS\",\"message\":\"Demasiadas tentativas. Tenta novamente daqui a alguns minutos.\"}");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private boolean isRateLimited(String ip) {
        long now = Instant.now().toEpochMilli();
        Window window = attemptsByIp.compute(ip, (key, existing) -> {
            if (existing == null || now - existing.startMillis() > WINDOW_MILLIS) {
                return new Window(now, new AtomicInteger(1));
            }
            existing.count().incrementAndGet();
            return existing;
        });
        return window.count().get() > MAX_ATTEMPTS;
    }

    private String clientIp(HttpServletRequest request) {
        String forwardedFor = request.getHeader("X-Forwarded-For");
        if (forwardedFor != null && !forwardedFor.isBlank()) {
            return forwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
