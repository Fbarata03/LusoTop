package com.lusotop.api.currency.dto;

import java.math.BigDecimal;

public record RateResponse(
        String from,
        String to,
        boolean available,
        BigDecimal rate
) {
}
