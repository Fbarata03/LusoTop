package com.lusotop.api.auth.dto;

public record AuthResponse(
        String token,
        UserResponse user
) {
}
