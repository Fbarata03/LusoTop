package com.lusotop.api.order;

import com.lusotop.api.common.BadRequestException;
import com.lusotop.api.common.NotFoundException;
import com.lusotop.api.country.Country;
import com.lusotop.api.country.CountryRepository;
import com.lusotop.api.currency.ExchangeRateService;
import com.lusotop.api.delivery.DingConnectService;
import com.lusotop.api.delivery.DingConnectTransferResult;
import com.lusotop.api.delivery.DingConnectTransferResult.ErrorKind;
import com.lusotop.api.email.EmailService;
import com.lusotop.api.notification.NotificationService;
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
import java.util.List;
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
    private final NotificationService notificationService;
    private final ReceiptService receiptService;
    private final EmailService emailService;

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
            DingConnectService dingConnectService,
            NotificationService notificationService,
            ReceiptService receiptService,
            EmailService emailService
    ) {
        this.orderRepository = orderRepository;
        this.countryRepository = countryRepository;
        this.operatorRepository = operatorRepository;
        this.productRepository = productRepository;
        this.exchangeRateService = exchangeRateService;
        this.dingConnectService = dingConnectService;
        this.notificationService = notificationService;
        this.receiptService = receiptService;
        this.emailService = emailService;
    }

    public CreateOrderResponse createOrder(CreateOrderRequest request, User user) {
        if (user == null) {
            throw new BadRequestException("AUTH_REQUIRED", "É necessário iniciar sessão para continuar.");
        }

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

        // Guardiao anti-prejuizo: nunca cria um checkout cujo preco nao cobre o custo real da
        // recarga + taxa Stripe + margem minima. Protege contra erros no catalogo (preco ou custo
        // mal configurados) -- no pior caso o produto fica indisponivel, nunca dando prejuizo.
        guardMargin(product, payerAmount);

        // Valida a recarga junto da DingConnect ANTES de cobrar o cliente. Se o numero for
        // invalido para a operadora, ou se o servico de entrega estiver indisponivel, o cliente
        // nunca chega a pagar -- em vez de pagar e receber um reembolso com uma mensagem alarmante.
        preValidateDelivery(product, request.phoneNumber());

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

    public List<OrderSummaryResponse> findMyOrders(User user) {
        return orderRepository.findAllByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(OrderSummaryResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public byte[] generateReceipt(Long orderId, User user) {
        Order order = orderRepository.findByIdAndUserId(orderId, user.getId())
                .orElseThrow(() -> new NotFoundException("ORDER_NOT_FOUND", "Pedido não encontrado."));
        if (order.getDeliveryStatus() != DeliveryStatus.DELIVERED) {
            throw new BadRequestException("ORDER_NOT_DELIVERED", "O comprovativo só está disponível depois da recarga ser entregue.");
        }
        return receiptService.generate(order);
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
        DeliveryParams params;
        try {
            params = resolveDeliveryParams(product);
        } catch (DeliveryConfigException e) {
            order.setDeliveryStatus(DeliveryStatus.FAILED);
            order.setDeliveryError(e.getMessage());
            log.error("Paid order {} tem produto {} mal configurado para entrega: {}", order.getId(), product.getId(), e.getMessage());
            refundFailedDelivery(order);
            notificationService.notifyRechargeFailed(order);
            return;
        }

        DingConnectTransferResult result = dingConnectService.sendTransfer(
                params.sku(),
                params.sendValue(),
                params.sendCurrency(),
                order.getPhoneNumber(),
                "lusotop-order-" + order.getId()
        );

        if (result.success()) {
            order.setDeliveryStatus(DeliveryStatus.DELIVERED);
            order.setDingconnectTransferRef(result.transferRef());
            order.setDeliveryError(result.errorKind() == ErrorKind.ALREADY_SENT
                    ? "Entrega confirmada (DistributorRef ja usado num envio anterior)."
                    : null);
            if (result.errorKind() == ErrorKind.ALREADY_SENT) {
                log.warn("Order {} marcada como entregue via ALREADY_SENT -- sem novo envio, sem reembolso.", order.getId());
            }
            notificationService.notifyRechargeDelivered(order);
            sendReceiptEmail(order);
        } else {
            order.setDeliveryStatus(DeliveryStatus.FAILED);
            order.setDeliveryError(result.errorMessage());
            log.error("Paid order {} nao pode ser entregue ({}): {}", order.getId(), result.errorKind(), result.errorMessage());
            refundFailedDelivery(order);
            notificationService.notifyRechargeFailed(order);
        }
    }

    /**
     * Corre a validacao da DingConnect (ValidateOnly) antes do checkout. Lanca BadRequestException
     * com uma mensagem util para o cliente se a recarga nao puder seguir -- sem nunca cobrar.
     */
    private void preValidateDelivery(AirtimeProduct product, String phoneNumber) {
        DeliveryParams params;
        try {
            params = resolveDeliveryParams(product);
        } catch (DeliveryConfigException e) {
            log.error("Produto {} mal configurado para entrega DingConnect: {}", product.getId(), e.getMessage());
            throw new BadRequestException("DELIVERY_UNAVAILABLE",
                    "Esta recarga está temporariamente indisponível. Tenta novamente mais tarde ou escolhe outro valor.");
        }

        DingConnectTransferResult check = dingConnectService.validateTransfer(
                params.sku(), params.sendValue(), params.sendCurrency(), phoneNumber, "lusotop-precheck");

        if (check.success() || check.errorKind() == ErrorKind.ALREADY_SENT) {
            return;
        }

        if (check.errorKind() == ErrorKind.INVALID_ACCOUNT) {
            throw new BadRequestException("INVALID_PHONE",
                    "O número indicado não parece válido para a operadora selecionada. Confirma o número (com indicativo do país) e tenta de novo.");
        }

        // SERVICE_UNAVAILABLE, INVALID_PRODUCT, INSUFFICIENT_FLOAT, UNKNOWN -> problema nosso/DingConnect.
        log.error("Pré-validação DingConnect falhou ({}) para sku={} numero={}: {}",
                check.errorKind(), params.sku(), phoneNumber, check.errorMessage());
        throw new BadRequestException("DELIVERY_UNAVAILABLE",
                "A recarga para esta operadora está temporariamente indisponível. Já estamos a tratar disso — tenta novamente dentro de alguns minutos.");
    }

    private DeliveryParams resolveDeliveryParams(AirtimeProduct product) {
        if (product.getDingconnectSkuCode() == null || product.getDingconnectSkuCode().isBlank()) {
            throw new DeliveryConfigException("Produto sem SKU DingConnect configurado.");
        }
        if (product.isDingconnectSendValueRange()) {
            // SKU de valor livre: o SendValue e o montante que o cliente ESCOLHEU entregar
            // (product.amount, na moeda do produto) -- nao o que pagou (payerAmount, que ja inclui
            // a margem). Enviar payerAmount aqui anulava a margem: a DingConnect debita a conta
            // pelo valor enviado, por isso mandar 23,60 quando o cliente pediu 20 nao deixava lucro.
            if (product.getAmount() == null || product.getCurrency() == null) {
                throw new DeliveryConfigException("Produto range sem amount/currency configurado.");
            }
            return new DeliveryParams(product.getDingconnectSkuCode(), product.getAmount(), product.getCurrency());
        }
        if (product.getDingconnectSendValue() == null || product.getDingconnectSendCurrency() == null) {
            // Produtos de valor fixo tem de usar o SendValue/SendCurrencyIso exato que a DingConnect
            // define para o SKU (ver GetProducts) -- nao o montante em moeda local. Sem isso
            // configurado, a DingConnect rejeita sempre com ParameterCombinationInvalid.
            throw new DeliveryConfigException("Produto sem SendValue/SendCurrency da DingConnect configurado.");
        }
        return new DeliveryParams(
                product.getDingconnectSkuCode(),
                product.getDingconnectSendValue(),
                product.getDingconnectSendCurrency());
    }

    private static final BigDecimal STRIPE_FEE_RATE = new BigDecimal("0.015");
    private static final BigDecimal MIN_MARGIN_EUR = new BigDecimal("1.00");

    /**
     * Bloqueia a criacao do pedido se o preco ao cliente nao cobrir o custo real da recarga + a
     * taxa da Stripe + uma margem liquida minima. E uma rede de seguranca contra dados de catalogo
     * errados: no pior caso o cliente ve "temporariamente indisponivel", nunca ha uma venda com
     * prejuizo.
     */
    private void guardMargin(AirtimeProduct product, BigDecimal payerAmount) {
        BigDecimal costEur = estimatedCostEur(product);
        if (costEur == null) {
            log.warn("Guardiao de margem: produto {} sem custo estimavel em EUR -- segue sem bloquear (ValidateOnly da DingConnect ainda corre).",
                    product.getId());
            return;
        }
        BigDecimal netAfterFee = payerAmount.multiply(BigDecimal.ONE.subtract(STRIPE_FEE_RATE));
        BigDecimal margin = netAfterFee.subtract(costEur);
        if (margin.compareTo(MIN_MARGIN_EUR) < 0) {
            log.error("GUARDIAO DE MARGEM bloqueou o produto {} ({} {} / sku {}): cliente pagaria {} EUR, "
                            + "custo estimado {} EUR, margem liquida {} EUR < minimo {} EUR.",
                    product.getId(), product.getAmount(), product.getCurrency(), product.getDingconnectSkuCode(),
                    payerAmount, costEur, margin, MIN_MARGIN_EUR);
            throw new BadRequestException("DELIVERY_UNAVAILABLE",
                    "Esta recarga está temporariamente indisponível. Escolhe outro valor ou tenta novamente mais tarde.");
        }
    }

    /**
     * Melhor estimativa do que esta recarga nos custa, em EUR:
     *  - produto "range": o valor que o cliente escolheu entregar (product.amount), convertido;
     *  - produto de valor fixo: o dingconnect_send_value -- o montante EXATO que a DingConnect
     *    debita da nossa conta para este SKU (as taxas efetivas da DingConnect sao bastante
     *    piores que o mercado, por isso o valor de face convertido subestimaria o custo).
     * null se nao houver base fiavel.
     */
    private BigDecimal estimatedCostEur(AirtimeProduct product) {
        try {
            if (product.isDingconnectSendValueRange()) {
                if (product.getAmount() == null || product.getCurrency() == null) {
                    return null;
                }
                return convert(product.getAmount(), product.getCurrency(), "EUR");
            }
            if (product.getDingconnectSendValue() != null) {
                String currency = product.getDingconnectSendCurrency() != null
                        ? product.getDingconnectSendCurrency() : "EUR";
                return convert(product.getDingconnectSendValue(), currency, "EUR");
            }
        } catch (RuntimeException e) {
            log.warn("Guardiao de margem: sem cambio para estimar o custo do produto {}: {}", product.getId(), e.getMessage());
        }
        return null;
    }

    private record DeliveryParams(String sku, BigDecimal sendValue, String sendCurrency) {
    }

    private static class DeliveryConfigException extends RuntimeException {
        DeliveryConfigException(String message) {
            super(message);
        }
    }

    private void sendReceiptEmail(Order order) {
        try {
            byte[] pdf = receiptService.generate(order);
            String html = """
                    <p>Olá %s,</p>
                    <p>A tua recarga de %s %s para %s (%s) foi entregue com sucesso.</p>
                    <p>Em anexo está o comprovativo em PDF.</p>
                    """.formatted(
                    order.getUser().getName(),
                    order.getPayerAmount(),
                    order.getPayerCurrency(),
                    order.getOperator().getName(),
                    order.getPhoneNumber()
            );
            emailService.send(
                    order.getUser().getEmail(),
                    "Comprovativo da tua recarga - LusoTop",
                    html,
                    "lusotop-comprovativo-" + order.getId() + ".pdf",
                    pdf
            );
        } catch (Exception e) {
            // Nunca deve impedir a entrega de ser marcada como concluida -- o comprovativo
            // continua disponivel para download manual em "Minhas recargas" mesmo que o email
            // falhe.
            log.error("Falha ao enviar comprovativo por email para a order {}", order.getId(), e);
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
