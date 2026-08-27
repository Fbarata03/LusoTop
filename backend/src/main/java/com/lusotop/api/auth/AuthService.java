package com.lusotop.api.auth;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.lusotop.api.auth.dto.AuthResponse;
import com.lusotop.api.auth.dto.LoginRequest;
import com.lusotop.api.auth.dto.RegisterRequest;
import com.lusotop.api.auth.dto.UserResponse;
import com.lusotop.api.common.BadRequestException;
import com.lusotop.api.common.ConflictException;
import com.lusotop.api.user.User;
import com.lusotop.api.user.UserRepository;
import com.lusotop.api.user.UserRole;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final GoogleIdTokenVerifier googleIdTokenVerifier;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            @Value("${app.google.client-id}") String googleClientId
    ) throws GeneralSecurityException, IOException {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.googleIdTokenVerifier = googleClientId == null || googleClientId.isBlank()
                ? null
                : new GoogleIdTokenVerifier.Builder(GoogleNetHttpTransport.newTrustedTransport(), GsonFactory.getDefaultInstance())
                        .setAudience(Collections.singletonList(googleClientId))
                        .build();
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmailIgnoreCase(request.email())) {
            throw new ConflictException("EMAIL_ALREADY_EXISTS", "Já existe uma conta com este email.");
        }

        User user = new User();
        user.setName(request.name());
        user.setEmail(request.email().toLowerCase());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setRole(UserRole.USER);
        user = userRepository.save(user);

        return buildAuthResponse(user);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmailIgnoreCase(request.email())
                .orElseThrow(() -> new BadCredentialsException("Email ou password incorretos."));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new BadCredentialsException("Email ou password incorretos.");
        }

        return buildAuthResponse(user);
    }

    public AuthResponse loginWithGoogle(String idToken) {
        if (googleIdTokenVerifier == null) {
            throw new BadRequestException("GOOGLE_NOT_CONFIGURED", "Login com Google não está configurado.");
        }

        GoogleIdToken token;
        try {
            token = googleIdTokenVerifier.verify(idToken);
        } catch (GeneralSecurityException | IOException | IllegalArgumentException e) {
            // IllegalArgumentException cobre tokens malformados (ex: nao e sequer um JWT valido) --
            // a biblioteca do Google nao usa so as excecoes documentadas para isso.
            throw new BadRequestException("GOOGLE_VERIFICATION_FAILED", "Não foi possível verificar o token do Google.");
        }
        if (token == null) {
            throw new BadRequestException("GOOGLE_TOKEN_INVALID", "Token do Google inválido ou expirado.");
        }

        GoogleIdToken.Payload payload = token.getPayload();
        String email = payload.getEmail();
        String name = (String) payload.get("name");

        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setName(name != null && !name.isBlank() ? name : email);
                    newUser.setEmail(email.toLowerCase());
                    // Conta criada via Google nao tem password propria -- gera-se um hash
                    // aleatorio e inutilizavel para satisfazer a coluna NOT NULL; nunca e usado
                    // para autenticar (loginWithGoogle nunca compara passwordHash).
                    newUser.setPasswordHash(passwordEncoder.encode(UUID.randomUUID().toString()));
                    newUser.setRole(UserRole.USER);
                    return userRepository.save(newUser);
                });

        return buildAuthResponse(user);
    }

    private AuthResponse buildAuthResponse(User user) {
        String token = jwtService.generateToken(user.getId(), user.getEmail(), user.getRole().name());
        return new AuthResponse(token, UserResponse.from(user));
    }
}
