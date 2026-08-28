package com.lusotop.api.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ResetPasswordRequest(
        @NotBlank(message = "Token em falta.")
        String token,

        @NotBlank(message = "A password é obrigatória.")
        @Size(min = 8, message = "A password deve ter pelo menos 8 caracteres.")
        String newPassword
) {
}
