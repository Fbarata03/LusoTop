package com.lusotop.api.order;

import com.lusotop.api.common.BadRequestException;
import com.lusotop.api.common.NotFoundException;
import com.lusotop.api.country.Country;
import com.lusotop.api.country.CountryRepository;
import com.lusotop.api.currency.ExchangeRateService;
import com.lusotop.api.delivery.DingConnectService;
import com.lusotop.api.delivery.DingConnectTransferResult;
import com.lusotop.api.operator.Operator;
import com.lusotop.api.operator.OperatorRepository;
import com.lusotop.api.order.dto.CreateOrderRequest;
import com.lusotop.api.order.dto.CreateOrderResponse;
import com.lusotop.api.order.dto.OrderSummaryResponse;
import com.lusotop.api.product.AirtimeProduct;
import com.lusotop.api.product.AirtimeProductRepository;
import com.lusotop.api.user.User;
import com.stripe.exception.StripeException;
import com.stripe.model.Refund;
import com.stripe.model.checkout.Session;
import com.stripe.param.RefundCreateParams;
import com.stripe.param.checkout.SessionCreateParams;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderService {

    private static final Logger log = LoggerFactory.getLogger(OrderService.class);

    private final OrderRepository orderRepository;
    private final CountryRepository countryRepository;
    private final OperatorRepository operatorRepository;
    private final AirtimeProductRepository productRepository;
    private final ExchangeRateService exchangeRateService;
    private final DingConnectService dingConnectService;

    @Value("${app.stripe.success-url}")
    private String successUrl;

    @Value("${app.stripe.cancel-url}")
    private String cancelUrl;

    public OrderService(
            OrderRepository orderRepository,
            CountryRepository countryRepository,
            OperatorRepository operatorRepository,
            AirtimeProductRepository productRepository,
            ExchangeRateService exchangeRateService,
            DingConnectService dingConnectService
    ) {
        this.orderRepository = orderRepository;
        this.countryRepository = countryRepository;
        this.operatorRepository = operatorRepository;
        this.productRepository = productRepository;
        this.exchangeRateService = exchangeRateService;
        this.dingConnectService = dingConnectService;
    }

    public CreateOrderResponse createOrder(CreateOrderRequest request, User user) {
        Country country = countryRepository.findByIsoCodeIgnoreCase(request.countryIso())
                .orElseThrow(() -> new NotFoundException("COUNTRY_NOT_FOUND", "País não encontrado."));

        Operator operator = operatorRepository.findById(request.operatorId())
                .orElseThrow(() -> new NotFoundException("OPERATOR_NOT_FOUND", "Operadora não encontrada."));
        if (!operator.getCountry().getId().equals(country.getId())) {
            throw new BadRequestException("OPERATOR_COUNTRY_MISMATCH", "Esta operadora não pertence ao país indicado.");
        }

        AirtimeProduct product = productRepository.findById(request.productId())
                .orElseThrow(() -> new NotFoundException("PRODUCT_NOT_FOUND", "Produto não encontrado."));
        if (!product.getOperator().getId().equals(operator.getId()) || !product.isActive()) {
            throw new BadRequestException("PRODUCT_OPERATOR_MISMATCH", "Este produto não está disponível para esta operadora.");
        }

        // Todo o pagamento e sempre em EUR -- a moeda do pagador nao e configuravel.
        // Produtos com stripe_price_id tem um preco real ja calculado (custo DingConnect +
        // margem + buffer de taxas Stripe) -- usa-se esse valor tal e qual, sem reconverter.
        String payerCurrency = "EUR";
        BigDecimal payerAmount = product.getPayerAmountCents() != null
                ? BigDecimal.valueOf(product.getPayerAmountCents(), 2)
                : convert(product.getAmount(), product.getCurrency(), payerCurrency);

        Order order = new Order();
        order.setUser(user);
        order.setCountry(country);
        order.setOperator(operator);
        order.setProduct(product);
        order.setPhoneNumber(request.phoneNumber());
        order.setProductAmount(product.getAmount());
        order.setProductCurrency(product.getCurrency());
        order.setPayerAmount(payerAmount);
        order.setPayerCurrency(payerCurrency);
        order.setStatus(OrderStatus.PENDING);
        order = orderRepository.save(order);

        Session session = createCheckoutSession(order, operator, country, product);
        order.setStripeCheckoutSessionId(session.getId());
        orderRepository.save(order);

        return new CreateOrderResponse(order.getId(), session.getUrl());
    }

    @Transactional
    public OrderSummaryResponse confirmOrder(String sessionId) {
        Order order = orderRepository.findByStripeCheckoutSessionId(sessionId)
                .orElseThrow(() -> new NotFoundException("ORDER_NOT_FOUND", "Pedido não encontrado."));

        if (order.getStatus() == OrderStatus.PENDING
                || (order.getStatus() == OrderStatus.PAID
                && order.getDeliveryStatus() == DeliveryStatus.PENDING)) {
            try {
                Session session = Session.retrieve(sessionId);
                if (order.getStatus() == OrderStatus.PENDING && "paid".equals(session.getPaymentStatus())) {
                    markPaidAndDeliver(order, session);
                } else if (order.getStatus() == OrderStatus.PAID) {
                    markPaidAndDeliver(order, session);
                } else if ("expired".equals(session.getStatus())) {
                    order.setStatus(OrderStatus.FAILED);
                }
                orderRepository.save(order);
            } catch (StripeException e) {
                log.error("Stripe session retrieval failed for order {}", order.getId(), e);
                throw new BadRequestException("STRIPE_ERROR", "Não foi possível confirmar o pagamento junto do Stripe.");
            }
        }

        return OrderSummaryResponse.from(order);
    }

    @Transactional
    public void handleCheckoutCompleted(String sessionId) {
        Order order = orderRepository.findByStripeCheckoutSessionId(sessionId)
                .orElseThrow(() -> new NotFoundException("ORDER_NOT_FOUND", "Pedido não encontrado."));

        if (order.getStatus() != OrderStatus.PENDING) return;

        try {
            Session session = Session.retrieve(sessionId);
            if ("paid".equals(session.getPaymentStatus())) {
                markPaidAndDeliver(order, session);
                orderRepository.save(order);
            }
        } catch (StripeException e) {
            log.error("Stripe session retrieval failed for webhook session {}", sessionId, e);
            throw new BadRequestException("STRIPE_ERROR", "Não foi possível confirmar o pagamento junto do Stripe.");
        }
    }

    private void markPaidAndDeliver(Order order, Session session) {
        order.setStatus(OrderStatus.PAID);
        order.setStripePaymentIntentId(session.getPaymentIntent());

        if (order.getDeliveryStatus() == DeliveryStatus.DELIVERED) return;

        AirtimeProduct product = order.getProduct();
        if (product.getDingconnectSkuCode() == null || product.getDingconnectSkuCode().isBlank()) {
            order.setDeliveryStatus(DeliveryStatus.FAILED);
            order.setDeliveryError("Produto sem SKU DingConnect configurado.");
            log.error("Paid order {} has no DingConnect SKU mapped for product {}", order.getId(), product.getId());
            refundFailedDelivery(order);
            return;
        }

        boolean rangeProduct = product.isDingconnectSendValueRange();
        BigDecimal sendValue = rangeProduct ? order.getPayerAmount() : order.getProductAmount();
        String sendCurrency = rangeProduct ? order.getPayerCurrency() : order.getProductCurrency();
        DingConnectTransferResult result = dingConnectService.sendTransfer(
                product.getDingconnectSkuCode(),
                sendValue,
                sendCurrency,
                order.getPhoneNumber(),
                "lusotop-order-" + order.getId()
        );

        if (result.success()) {
            order.setDeliveryStatus(DeliveryStatus.DELIVERED);
            order.setDingconnectTransferRef(result.transferRef());
            order.setDeliveryError(null);
        } else {
            order.setDeliveryStatus(DeliveryStatus.FAILED);
            order.setDeliveryError(result.errorMessage());
            log.error("Paid order {} could not be delivered: {}", order.getId(), result.errorMessage());
            refundFailedDelivery(order);
        }
    }

    private void refundFailedDelivery(Order order) {
        if (order.isRefunded() || order.getStripePaymentIntentId() == null) return;
        try {
            Refund refund = Refund.create(
                    RefundCreateParams.builder()
                            .setPaymentIntent(order.getStripePaymentIntentId())
                            .build()
            );
            order.setRefunded(true);
            order.setStripeRefundId(refund.getId());
        } catch (StripeException e) {
            log.error("Automatic refund failed for order {} (payment_intent={})",
                    order.getId(), order.getStripePaymentIntentId(), e);
        }
    }

    private Session createCheckoutSession(Order order, Operator operator, Country country, AirtimeProduct product) {
        SessionCreateParams.LineItem lineItem = product.getStripePriceId() != null
                ? SessionCreateParams.LineItem.builder()
                        .setQuantity(1L)
                        .setPrice(product.getStripePriceId())
                        .build()
                : SessionCreateParams.LineItem.builder()
                        .setQuantity(1L)
                        .setPriceData(
                                SessionCreateParams.LineItem.PriceData.builder()
                                        .setCurrency(order.getPayerCurrency().toLowerCase())
                                        .setUnitAmount(order.getPayerAmount()
                                                .multiply(BigDecimal.valueOf(100))
                                                .setScale(0, RoundingMode.HALF_UP)
                                                .longValueExact())
                                        .setProductData(
                                                SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                        .setName("Recarga " + operator.getName() + " — " + country.getName())
                                                        .setDescription("Para o número " + order.getPhoneNumber())
                                                        .build()
                                        )
                                        .build()
                        )
                        .build();

        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(successUrl)
                .setCancelUrl(cancelUrl)
                .setClientReferenceId(String.valueOf(order.getId()))
                .putMetadata("orderId", String.valueOf(order.getId()))
                .addLineItem(lineItem)
                // Managed Payments is on by default on this account and requires a Stripe Tax
                // product tax code on every line item; we don't use Stripe Tax, so opt out.
                .putExtraParam("managed_payments[enabled]", false)
                .build();

        try {
            return Session.create(params);
        } catch (StripeException e) {
            log.error("Stripe checkout session creation failed for order {}", order.getId(), e);
            if ("amount_too_small".equals(e.getCode())) {
                throw new BadRequestException(
                        "AMOUNT_TOO_SMALL",
                        "Este valor é demasiado baixo para ser pago por cartão. Escolhe um valor mais alto."
                );
            }
            throw new BadRequestException("STRIPE_ERROR", "Não foi possível iniciar o pagamento. Tente novamente.");
        }
    }

    private BigDecimal convert(BigDecimal amount, String fromCurrency, String toCurrency) {
        if (fromCurrency.equalsIgnoreCase(toCurrency)) {
            return amount.setScale(2, RoundingMode.HALF_UP);
        }
        return exchangeRateService.getRate(fromCurrency, toCurrency)
                .map(rate -> amount.multiply(rate).setScale(2, RoundingMode.HALF_UP))
                .orElseThrow(() -> new BadRequestException(
                        "EXCHANGE_RATE_UNAVAILABLE",
                        "Conversão indisponível para " + fromCurrency + " → " + toCurrency + "."
                ));
    }
}
