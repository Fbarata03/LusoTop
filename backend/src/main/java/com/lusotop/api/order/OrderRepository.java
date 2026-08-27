package com.lusotop.api.order;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;

import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {

    @EntityGraph(attributePaths = {"country", "operator"})
    Optional<Order> findByStripeCheckoutSessionId(String stripeCheckoutSessionId);
}
