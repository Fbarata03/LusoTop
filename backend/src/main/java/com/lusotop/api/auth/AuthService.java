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
import com.lusotop.api.email.EmailService;
import com.lusotop.api.user.User;
import com.lusotop.api.user.UserRepository;
import com.lusotop.api.user.UserRole;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.Collections;
import java.util.HexFormat;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    // Hash bcrypt valido de uma password que ninguem tem -- usado para que login() gaste sempre o
    // mesmo tempo a comparar a password, mesmo quando o email nao existe. Sem isto, um pedido a um
    // email inexistente responde muito mais rapido (sem custo de bcrypt) do que um pedido a um
    // email real com password errada, permitindo a um atacante descobrir que emails tem conta so
    // por medir o tempo de resposta.
    private static final String DUMMY_PASSWORD_HASH =
            "$2a$10$7EqJtq98hPqEX7fNZaFWoOhi5L2ex4M3lTQGb4tj7rTGP6Kd9jvfa";

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();
    private static final Duration RESET_TOKEN_TTL = Duration.ofHours(1);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final GoogleIdTokenVerifier googleIdTokenVerifier;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final EmailService emailService;
    private final String frontendBaseUrl;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            PasswordResetTokenRepository passwordResetTokenRepository,
            EmailService emailService,
            @Value("${app.google.client-id}") String googleClientId,
            @Value("${app.frontend.base-url}") String frontendBaseUrl
    ) throws GeneralSecurityException, IOException {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.emailService = emailService;
        this.frontendBaseUrl = frontendBaseUrl;
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
        Optional<User> user = userRepository.findByEmailIgnoreCase(request.email());

        // Compara sempre contra um hash (real ou dummy) antes de decidir, para que o tempo de
        // resposta nao revele se o email existe.
        String hashToCheck = user.map(User::getPasswordHash).orElse(DUMMY_PASSWORD_HASH);
        boolean matches = passwordEncoder.matches(request.password(), hashToCheck);

        if (user.isEmpty() || !matches) {
            throw new BadCredentialsException("Email ou password incorretos.");
        }

        return buildAuthResponse(user.get());
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

    /** Sempre "sucesso" do ponto de vista do chamador, exista ou nao o email -- evita confirmar
     * quais emails tem conta. */
    public void forgotPassword(String email) {
        userRepository.findByEmailIgnoreCase(email).ifPresent(user -> {
            String rawToken = generateRawToken();

            PasswordResetToken resetToken = new PasswordResetToken();
            resetToken.setUser(user);
            resetToken.setTokenHash(hashToken(rawToken));
            resetToken.setExpiresAt(Instant.now().plus(RESET_TOKEN_TTL));
            passwordResetTokenRepository.save(resetToken);

            String link = frontendBaseUrl + "/redefinir-password?token=" + rawToken;
            String html = """
                    <p>Olá %s,</p>
                    <p>Recebemos um pedido para redefinir a password da tua conta LusoTop.</p>
                    <p><a href="%s">Clica aqui para escolher uma password nova</a></p>
                    <p>Este link expira daqui a 1 hora. Se não pediste isto, ignora este email.</p>
                    """.formatted(user.getName(), link);
            emailService.send(user.getEmail(), "Redefinir a tua password - LusoTop", html);
        });
    }

    public void resetPassword(String rawToken, String newPassword) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByTokenHash(hashToken(rawToken))
                .filter(PasswordResetToken::isValid)
                .orElseThrow(() -> new BadRequestException("INVALID_RESET_TOKEN", "Este link é inválido ou já expirou."));

        User user = resetToken.getUser();
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        resetToken.setUsedAt(Instant.now());
        passwordResetTokenRepository.save(resetToken);
    }

    private String generateRawToken() {
        byte[] bytes = new byte[32];
        SECURE_RANDOM.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private String hashToken(String rawToken) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(rawToken.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
    }

    private AuthResponse buildAuthResponse(User user) {
        String token = jwtService.generateToken(user.getId(), user.getEmail(), user.getRole().name());
        return new AuthResponse(token, UserResponse.from(user));
    }
}
