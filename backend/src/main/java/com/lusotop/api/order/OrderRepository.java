package com.lusotop.api.order;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;

import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {

    // Bloqueio pessimista: o webhook do Stripe e o polling do frontend (confirmOrder) podem
    // chegar em simultaneo para o mesmo pedido -- sem lock, ambos passariam pelo mesmo check de
    // estado PENDING e disparariam duas chamadas SendTransfer para a DingConnect.
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @EntityGraph(attributePaths = {"country", "operator"})
    Optional<Order> findByStripeCheckoutSessionId(String stripeCheckoutSessionId);
}
