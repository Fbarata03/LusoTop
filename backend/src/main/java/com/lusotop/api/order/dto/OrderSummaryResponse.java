package com.lusotop.api.order.dto;

import com.lusotop.api.order.Order;

import java.math.BigDecimal;

public record OrderSummaryResponse(
        Long id,
        String status,
        String countryName,
        String countryIso,
        String operatorName,
        String operatorLogoUrl,
        String phoneNumber,
        BigDecimal productAmount,
        String productCurrency,
        BigDecimal payerAmount,
        String payerCurrency
) {

    public static OrderSummaryResponse from(Order order) {
        return new OrderSummaryResponse(
                order.getId(),
                order.getStatus().name(),
                order.getCountry().getName(),
                order.getCountry().getIsoCode(),
                order.getOperator().getName(),
                order.getOperator().getLogoUrl(),
                order.getPhoneNumber(),
                order.getProductAmount(),
                order.getProductCurrency(),
                order.getPayerAmount(),
                order.getPayerCurrency()
        );
    }
}
