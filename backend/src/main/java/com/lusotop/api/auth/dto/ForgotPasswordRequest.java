package com.lusotop.api.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ForgotPasswordRequest(
        @NotBlank(message = "O email é obrigatório.")
        @Email(message = "Introduza um email válido.")
        String email
) {
}
