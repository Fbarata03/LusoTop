package com.lusotop.api.product;

import com.lusotop.api.operator.Operator;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "airtime_products")
@Getter
@Setter
@NoArgsConstructor
public class AirtimeProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "operator_id", nullable = false)
    private Operator operator;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(nullable = false)
    private String currency;

    @Column(nullable = false)
    private String type;

    private String label;

    /** Preco real do catalogo Stripe (custo DingConnect + margem + buffer de taxas Stripe). */
    @Column(name = "stripe_price_id")
    private String stripePriceId;

    @Column(name = "payer_amount_cents")
    private Integer payerAmountCents;

    /** SKU real da DingConnect para este produto (ver GetProducts). */
    @Column(name = "dingconnect_sku_code")
    private String dingconnectSkuCode;

    /** Se true, o SendTransfer usa SendValue = payerAmountCents/100 em vez de um ReceiveValue fixo. */
    @Column(name = "dingconnect_send_value_range", nullable = false)
    private boolean dingconnectSendValueRange;

    /**
     * Para produtos de valor fixo (dingconnectSendValueRange = false): o SendValue/SendCurrencyIso
     * exato que a DingConnect exige para este SKU (Minimum.SendValue do GetProducts -- para um SKU
     * fixo, Minimum == Maximum). NAO e o mesmo que o montante em moeda local (amount/currency) --
     * a DingConnect so aceita o valor dela propria aqui, normalmente em EUR.
     */
    @Column(name = "dingconnect_send_value", precision = 12, scale = 4)
    private java.math.BigDecimal dingconnectSendValue;

    @Column(name = "dingconnect_send_currency", length = 3)
    private String dingconnectSendCurrency;

    @Column(nullable = false)
    private boolean active;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}
