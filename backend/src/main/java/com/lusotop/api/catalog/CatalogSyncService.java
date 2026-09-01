package com.lusotop.api.catalog;

import com.lusotop.api.common.BadRequestException;
import com.lusotop.api.currency.ExchangeRateService;
import com.lusotop.api.delivery.DingConnectService;
import com.lusotop.api.delivery.DingConnectService.DingPriceBound;
import com.lusotop.api.delivery.DingConnectService.DingProduct;
import com.lusotop.api.operator.Operator;
import com.lusotop.api.operator.OperatorRepository;
import com.lusotop.api.product.AirtimeProduct;
import com.lusotop.api.product.AirtimeProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Sincroniza o catalogo local (airtime_products) com o catalogo real e atual da DingConnect
 * (GetProducts). Corrige o custo exato de cada SKU (dingconnect_send_value / _currency), se e um
 * SKU de valor fixo ou "range" (dingconnect_send_value_range) e recalcula o preco ao cliente
 * (payer_amount_cents) de forma deterministica:
 *
 *   preco = ROUND( (custo_eur + 3.00 margem + 0.25 buffer) / (1 - 0.015 taxa Stripe) )
 *
 * {@link #audit()} nao escreve nada -- devolve o relatorio do que mudaria. {@link #resync()}
 * aplica. Ambos sao operacoes de admin, nunca no caminho de um pedido.
 */
@Service
public class CatalogSyncService {

    private static final Logger log = LoggerFactory.getLogger(CatalogSyncService.class);

    private static final BigDecimal MARGIN_EUR = new BigDecimal("3.00");
    private static final BigDecimal BUFFER_EUR = new BigDecimal("0.25");
    private static final BigDecimal STRIPE_KEEP_RATE = new BigDecimal("0.985");

    private final AirtimeProductRepository productRepository;
    private final OperatorRepository operatorRepository;
    private final DingConnectService dingConnectService;
    private final ExchangeRateService exchangeRateService;

    public CatalogSyncService(
            AirtimeProductRepository productRepository,
            OperatorRepository operatorRepository,
            DingConnectService dingConnectService,
            ExchangeRateService exchangeRateService
    ) {
        this.productRepository = productRepository;
        this.operatorRepository = operatorRepository;
        this.dingConnectService = dingConnectService;
        this.exchangeRateService = exchangeRateService;
    }

    @Transactional(readOnly = true)
    public CatalogAuditReport audit() {
        return run(false);
    }

    @Transactional
    public CatalogAuditReport resync() {
        return run(true);
    }

    /** Resposta bruta do GetProducts para os provider codes que usamos (inspeção/depuração). */
    @Transactional(readOnly = true)
    public String rawDingConnectCatalog() {
        Set<String> providerCodes = operatorRepository.findAll().stream()
                .map(Operator::getProviderCode)
                .filter(c -> c != null && !c.isBlank())
                .collect(Collectors.toCollection(LinkedHashSet::new));
        return dingConnectService.getProductsRaw(providerCodes);
    }

    private CatalogAuditReport run(boolean apply) {
        Set<String> providerCodes = operatorRepository.findAll().stream()
                .map(Operator::getProviderCode)
                .filter(c -> c != null && !c.isBlank())
                .collect(Collectors.toCollection(LinkedHashSet::new));

        List<DingProduct> catalog;
        try {
            catalog = dingConnectService.getProducts(providerCodes);
        } catch (RuntimeException e) {
            throw new BadRequestException("DINGCONNECT_CATALOG_ERROR", e.getMessage());
        }
        Map<String, DingProduct> bySku = catalog.stream()
                .filter(p -> p.skuCode() != null)
                .collect(Collectors.toMap(DingProduct::skuCode, Function.identity(), (a, b) -> a));

        // Rede de seguranca: se o GetProducts vier vazio ou implausivelmente pequeno (ex: filtro
        // de provider codes rejeitado, formato de resposta inesperado), NAO aplicar nada -- caso
        // contrario o resync desativaria todo o catalogo por "SKU nao encontrado".
        if (apply && bySku.size() < 10) {
            throw new BadRequestException("DINGCONNECT_CATALOG_SUSPEITO", "GetProducts devolveu apenas "
                    + bySku.size() + " SKUs -- resposta suspeita. Resync abortado sem alteracoes. "
                    + "Verifica GET /api/admin/catalog/dingconnect-raw.");
        }

        List<CatalogAuditRow> rows = new ArrayList<>();
        int updated = 0;
        int deactivated = 0;

        for (AirtimeProduct product : productRepository.findAll()) {
            String sku = product.getDingconnectSkuCode();
            if (sku == null || sku.isBlank()) {
                continue;
            }

            CatalogAuditRow row = new CatalogAuditRow();
            row.productId = product.getId();
            row.sku = sku;
            row.operator = product.getOperator() != null ? product.getOperator().getName() : null;
            row.amount = product.getAmount();
            row.currency = product.getCurrency();
            row.wasActive = product.isActive();
            row.currentPriceCents = product.getPayerAmountCents();
            row.currentSendValue = product.getDingconnectSendValue();
            row.currentRange = product.isDingconnectSendValueRange();

            DingProduct ding = bySku.get(sku);
            if (ding == null) {
                row.verdict = "SKU_NAO_ENCONTRADO";
                row.note = "SKU já não existe no GetProducts da DingConnect.";
                row.proposedActive = false;
                if (apply && product.isActive()) {
                    product.setActive(false);
                    deactivated++;
                }
                rows.add(row);
                continue;
            }

            DingPriceBound min = ding.minimum();
            DingPriceBound max = ding.maximum();
            if (min == null || min.sendValue() == null || min.sendCurrencyIso() == null
                    || max == null || max.sendValue() == null) {
                row.verdict = "SEM_LIMITES";
                row.note = "GetProducts devolveu o SKU sem Minimum/Maximum utilizáveis.";
                rows.add(row);
                continue;
            }

            boolean rangeSku = min.sendValue().compareTo(max.sendValue()) != 0;
            row.dingMinSend = min.sendValue();
            row.dingMaxSend = max.sendValue();
            row.dingSendCurrency = min.sendCurrencyIso();

            // Base de custo:
            //  - SKU range: o cliente escolhe quanto entregar (product.amount na moeda do produto).
            //  - SKU fixo: o custo e o SendValue unico que a DingConnect define.
            BigDecimal costValue;
            String costCurrency;
            if (rangeSku) {
                costValue = product.getAmount();
                costCurrency = product.getCurrency();
                if (costValue == null || costCurrency == null) {
                    row.verdict = "PRODUTO_SEM_AMOUNT";
                    row.note = "SKU range mas o produto não tem amount/currency.";
                    rows.add(row);
                    continue;
                }
                if (!costCurrency.equalsIgnoreCase(min.sendCurrencyIso())) {
                    row.note = "Aviso: moeda do produto (" + costCurrency + ") != SendCurrency do SKU ("
                            + min.sendCurrencyIso() + ").";
                }
            } else {
                costValue = min.sendValue();
                costCurrency = min.sendCurrencyIso();
            }

            BigDecimal costEur = toEur(costValue, costCurrency);
            if (costEur == null) {
                row.verdict = "SEM_CAMBIO";
                row.note = "Sem taxa de câmbio para " + costCurrency + " → EUR.";
                rows.add(row);
                continue;
            }
            row.costEur = costEur.setScale(4, RoundingMode.HALF_UP);

            int newPriceCents = price(costEur);
            row.proposedPriceCents = newPriceCents;
            row.proposedRange = rangeSku;
            row.proposedSendValue = rangeSku ? product.getAmount() : min.sendValue();
            row.proposedSendCurrency = rangeSku ? product.getCurrency() : min.sendCurrencyIso();
            row.proposedActive = true;

            BigDecimal currentNetEur = product.getPayerAmountCents() != null
                    ? BigDecimal.valueOf(product.getPayerAmountCents(), 2).multiply(STRIPE_KEEP_RATE)
                    : null;
            if (currentNetEur != null && currentNetEur.subtract(costEur).compareTo(BigDecimal.ONE) < 0) {
                row.verdict = "RISCO_PREJUIZO";
                row.note = appendNote(row.note, "Preço atual não cobre o custo + 1 EUR de margem.");
            } else if (product.getPayerAmountCents() == null
                    || product.getPayerAmountCents() != newPriceCents) {
                row.verdict = "PRECO_CORRIGIDO";
            } else {
                row.verdict = "OK";
            }

            if (apply) {
                boolean changed = false;
                if (product.isDingconnectSendValueRange() != rangeSku) {
                    product.setDingconnectSendValueRange(rangeSku);
                    changed = true;
                }
                if (!rangeSku) {
                    if (!min.sendValue().equals(product.getDingconnectSendValue())) {
                        product.setDingconnectSendValue(min.sendValue());
                        changed = true;
                    }
                    if (!min.sendCurrencyIso().equalsIgnoreCase(nullSafe(product.getDingconnectSendCurrency()))) {
                        product.setDingconnectSendCurrency(min.sendCurrencyIso());
                        changed = true;
                    }
                } else {
                    // range: manter o campo coerente com o valor entregue (amount/currency)
                    if (product.getAmount() != null
                            && !product.getAmount().equals(product.getDingconnectSendValue())) {
                        product.setDingconnectSendValue(product.getAmount());
                        changed = true;
                    }
                    if (!product.getCurrency().equalsIgnoreCase(nullSafe(product.getDingconnectSendCurrency()))) {
                        product.setDingconnectSendCurrency(product.getCurrency());
                        changed = true;
                    }
                }
                if (product.getPayerAmountCents() == null || product.getPayerAmountCents() != newPriceCents) {
                    product.setPayerAmountCents(newPriceCents);
                    changed = true;
                }
                if (changed) {
                    updated++;
                }
            }

            rows.add(row);
        }

        if (apply) {
            log.warn("CatalogSync RESYNC aplicado: {} produtos atualizados, {} desativados (SKU inexistente).",
                    updated, deactivated);
        }

        return new CatalogAuditReport(apply, catalog.size(), rows.size(), updated, deactivated, rows);
    }

    private int price(BigDecimal costEur) {
        return costEur.add(MARGIN_EUR).add(BUFFER_EUR)
                .divide(STRIPE_KEEP_RATE, 6, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100))
                .setScale(0, RoundingMode.HALF_UP)
                .intValueExact();
    }

    private BigDecimal toEur(BigDecimal value, String currency) {
        if (value == null || currency == null) {
            return null;
        }
        if (currency.equalsIgnoreCase("EUR")) {
            return value;
        }
        return exchangeRateService.getRate(currency, "EUR")
                .map(rate -> value.multiply(rate))
                .orElse(null);
    }

    private static String nullSafe(String s) {
        return s == null ? "" : s;
    }

    private static String appendNote(String existing, String extra) {
        if (existing == null || existing.isBlank()) {
            return extra;
        }
        return existing + " " + extra;
    }
}
