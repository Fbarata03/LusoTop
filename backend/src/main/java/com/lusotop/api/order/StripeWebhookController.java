package com.lusotop.api.order;

import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.model.StripeObject;
import com.stripe.net.Webhook;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/webhooks/stripe")
public class StripeWebhookController {

    private final OrderService orderService;
    private final String webhookSecret;

    public StripeWebhookController(
            OrderService orderService,
            @Value("${app.stripe.webhook-secret}") String webhookSecret
    ) {
        this.orderService = orderService;
        this.webhookSecret = webhookSecret;
    }

    @PostMapping
    public ResponseEntity<Void> handle(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String signature
    ) {
        try {
            Event event = Webhook.constructEvent(payload, signature, webhookSecret);
            if ("checkout.session.completed".equals(event.getType())) {
                StripeObject stripeObject = event.getDataObjectDeserializer().getObject().orElse(null);
                if (stripeObject instanceof Session session) {
                    orderService.handleCheckoutCompleted(session.getId());
                }
            }
            return ResponseEntity.ok().build();
        } catch (SignatureVerificationException | RuntimeException exception) {
            return ResponseEntity.badRequest().build();
        }
    }
}