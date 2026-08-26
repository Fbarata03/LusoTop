package com.lusotop.api.order.dto;

public record CreateOrderResponse(
        Long orderId,
        String checkoutUrl
) {
}
