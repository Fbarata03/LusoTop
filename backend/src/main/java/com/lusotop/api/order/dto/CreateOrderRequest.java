package com.lusotop.api.order.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateOrderRequest(
        @NotBlank String countryIso,
        @NotNull Long operatorId,
        @NotNull Long productId,
        @NotBlank String phoneNumber,
        @NotBlank String payerCurrency
) {
}
