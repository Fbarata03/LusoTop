package com.lusotop.api.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "O nome é obrigatório.")
        @Size(max = 150, message = "O nome é demasiado longo.")
        String name,

        @NotBlank(message = "O email é obrigatório.")
        @Email(message = "Introduza um email válido.")
        String email,

        @NotBlank(message = "A password é obrigatória.")
        @Size(min = 8, message = "A password deve ter pelo menos 8 caracteres.")
        String password
) {
}
