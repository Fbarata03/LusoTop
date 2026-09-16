package com.lusotop.api.catalog;

import java.math.BigDecimal;
import java.util.List;

/**
 * Um SKU do catálogo real da DingConnect (GetProducts) cujos Benefits sugerem um pacote de dados
 * móveis (não saldo/airtime). {@code alreadyExists} indica se já temos este SKU em
 * airtime_products -- só interessa criar produto novo quando for false.
 */
public record DataProductCandidate(
        String operatorName,
        Long operatorId,
        String providerCode,
        String skuCode,
        List<String> benefits,
        BigDecimal minSendValue,
        BigDecimal maxSendValue,
        String sendCurrency,
        boolean alreadyExists
) {
}
