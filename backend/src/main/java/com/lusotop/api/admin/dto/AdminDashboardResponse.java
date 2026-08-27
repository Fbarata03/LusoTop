package com.lusotop.api.admin.dto;

import java.math.BigDecimal;

public record AdminDashboardResponse(
        long totalCustomers,
        long totalOrders,
        long deliveredOrders,
        long pendingDeliveryOrders,
        long failedDeliveryOrders,
        long paidOrders,
        long failedPayments,
        BigDecimal totalRevenueEur,
        long ordersToday,
        long ordersThisMonth
) {
}
