package com.lusotop.api.admin.dto;

import com.lusotop.api.order.Order;

import java.math.BigDecimal;
import java.time.Instant;

public record AdminOrderResponse(
        Long id,
        String customerName,
        String customerEmail,
        String status,
        String deliveryStatus,
        boolean refunded,
        String countryName,
        String operatorName,
        String phoneNumber,
        BigDecimal payerAmount,
        String payerCurrency,
        String stripePaymentIntentId,
        String dingconnectTransferRef,
        String deliveryError,
        Instant createdAt
) {

    public static AdminOrderResponse from(Order order) {
        return new AdminOrderResponse(
                order.getId(),
                order.getUser() != null ? order.getUser().getName() : null,
                order.getUser() != null ? order.getUser().getEmail() : null,
                order.getStatus().name(),
                order.getDeliveryStatus().name(),
                order.isRefunded(),
                order.getCountry().getName(),
                order.getOperator().getName(),
                order.getPhoneNumber(),
                order.getPayerAmount(),
                order.getPayerCurrency(),
                order.getStripePaymentIntentId(),
                order.getDingconnectTransferRef(),
                order.getDeliveryError(),
                order.getCreatedAt()
        );
    }
}
