package com.lusotop.api.admin.dto;

import java.math.BigDecimal;
import java.time.Instant;

public record AdminCustomerResponse(
        Long id,
        String name,
        String email,
        Instant createdAt,
        long orderCount,
        BigDecimal totalSpentEur,
        Instant lastActivity
) {
}
