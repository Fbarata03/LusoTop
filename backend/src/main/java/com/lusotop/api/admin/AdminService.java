package com.lusotop.api.admin;

import com.lusotop.api.admin.dto.AdminCustomerResponse;
import com.lusotop.api.admin.dto.AdminDashboardResponse;
import com.lusotop.api.admin.dto.AdminOrderResponse;
import com.lusotop.api.order.DeliveryStatus;
import com.lusotop.api.order.OrderRepository;
import com.lusotop.api.order.OrderStatus;
import com.lusotop.api.user.User;
import com.lusotop.api.user.UserRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.List;

@Service
public class AdminService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    public AdminService(OrderRepository orderRepository, UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }

    public AdminDashboardResponse dashboard() {
        Instant startOfToday = LocalDate.now(ZoneOffset.UTC).atStartOfDay().toInstant(ZoneOffset.UTC);
        Instant startOfMonth = LocalDate.now(ZoneOffset.UTC).withDayOfMonth(1).atStartOfDay().toInstant(ZoneOffset.UTC);

        return new AdminDashboardResponse(
                userRepository.count(),
                orderRepository.count(),
                orderRepository.countByStatusAndDeliveryStatus(OrderStatus.PAID, DeliveryStatus.DELIVERED),
                orderRepository.countByStatusAndDeliveryStatus(OrderStatus.PAID, DeliveryStatus.PENDING),
                orderRepository.countByStatusAndDeliveryStatus(OrderStatus.PAID, DeliveryStatus.FAILED),
                orderRepository.countByStatus(OrderStatus.PAID),
                orderRepository.countByStatus(OrderStatus.FAILED),
                orderRepository.sumPayerAmountForPaidOrders(),
                orderRepository.countByCreatedAtAfter(startOfToday),
                orderRepository.countByCreatedAtAfter(startOfMonth)
        );
    }

    public List<AdminOrderResponse> orders() {
        return orderRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(AdminOrderResponse::from)
                .toList();
    }

    public List<AdminCustomerResponse> customers() {
        return userRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toCustomerResponse)
                .toList();
    }

    private AdminCustomerResponse toCustomerResponse(User user) {
        Instant lastActivity = orderRepository.findTopByUserIdOrderByCreatedAtDesc(user.getId())
                .map(order -> order.getCreatedAt())
                .orElse(user.getCreatedAt());

        return new AdminCustomerResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getCreatedAt(),
                orderRepository.countByUserId(user.getId()),
                orderRepository.sumPayerAmountForPaidOrdersByUser(user.getId()),
                lastActivity
        );
    }
}
