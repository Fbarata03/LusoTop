package com.lusotop.api.operator.dto;

import com.lusotop.api.operator.Operator;

import java.math.BigDecimal;

public record OperatorResponse(
        Long id,
        String name,
        String code,
        String logoUrl,
        BigDecimal minAmount,
        BigDecimal maxAmount
) {

    public static OperatorResponse from(Operator operator) {
        return new OperatorResponse(
                operator.getId(),
                operator.getName(),
                operator.getCode(),
                operator.getLogoUrl(),
                operator.getMinAmount(),
                operator.getMaxAmount()
        );
    }
}
