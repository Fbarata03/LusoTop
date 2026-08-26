package com.lusotop.api.order;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {

    Optional<Order> findByStripeCheckoutSessionId(String stripeCheckoutSessionId);
}
