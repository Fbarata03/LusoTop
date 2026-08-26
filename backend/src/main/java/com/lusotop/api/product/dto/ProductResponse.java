package com.lusotop.api.product.dto;

import com.lusotop.api.product.AirtimeProduct;

import java.math.BigDecimal;

public record ProductResponse(
        Long id,
        BigDecimal amount,
        String currency,
        String type,
        String label,
        BigDecimal payerAmountEur
) {

    public static ProductResponse from(AirtimeProduct product) {
        return new ProductResponse(
                product.getId(),
                product.getAmount(),
                product.getCurrency(),
                product.getType(),
                product.getLabel(),
                product.getPayerAmountCents() != null
                        ? BigDecimal.valueOf(product.getPayerAmountCents(), 2)
                        : null
        );
    }
}
