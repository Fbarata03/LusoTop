package com.lusotop.api.notification.dto;

import com.lusotop.api.notification.Notification;

import java.time.Instant;

public record NotificationResponse(
        Long id,
        String type,
        String title,
        String message,
        boolean read,
        Long orderId,
        Instant createdAt
) {

    public static NotificationResponse from(Notification notification) {
        return new NotificationResponse(
                notification.getId(),
                notification.getType().name(),
                notification.getTitle(),
                notification.getMessage(),
                notification.isRead(),
                notification.getOrder() != null ? notification.getOrder().getId() : null,
                notification.getCreatedAt()
        );
    }
}
