package com.lusotop.api.auth.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank(message = "O email é obrigatório.")
        String email,

        @NotBlank(message = "A password é obrigatória.")
        String password
) {
}
