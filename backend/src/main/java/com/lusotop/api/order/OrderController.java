package com.lusotop.api.order;

import com.lusotop.api.order.dto.CreateOrderRequest;
import com.lusotop.api.order.dto.CreateOrderResponse;
import com.lusotop.api.order.dto.OrderSummaryResponse;
import com.lusotop.api.user.User;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<CreateOrderResponse> create(
            @Valid @RequestBody CreateOrderRequest request,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(orderService.createOrder(request, user));
    }

    @GetMapping("/session/{sessionId}")
    public OrderSummaryResponse confirm(@PathVariable String sessionId) {
        return orderService.confirmOrder(sessionId);
    }

    @GetMapping("/mine")
    public List<OrderSummaryResponse> mine(@AuthenticationPrincipal User user) {
        return orderService.findMyOrders(user);
    }

    @GetMapping("/{id}/receipt")
    public ResponseEntity<byte[]> receipt(@PathVariable Long id, @AuthenticationPrincipal User user) {
        byte[] pdf = orderService.generateReceipt(id, user);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.attachment().filename("lusotop-comprovativo-" + id + ".pdf").build().toString())
                .body(pdf);
    }
}
