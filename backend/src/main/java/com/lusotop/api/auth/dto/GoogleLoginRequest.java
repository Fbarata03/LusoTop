package com.lusotop.api.auth.dto;

import jakarta.validation.constraints.NotBlank;

public record GoogleLoginRequest(
        @NotBlank(message = "O idToken é obrigatório.")
        String idToken
) {
}
