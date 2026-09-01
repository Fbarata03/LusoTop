package com.lusotop.api.catalog;

import java.math.BigDecimal;

/** Uma linha do relatório de auditoria/sincronização de catálogo (um produto local). */
public class CatalogAuditRow {

    public Long productId;
    public String sku;
    public String operator;
    public BigDecimal amount;
    public String currency;
    public boolean wasActive;

    public Integer currentPriceCents;
    public BigDecimal currentSendValue;
    public boolean currentRange;

    public BigDecimal dingMinSend;
    public BigDecimal dingMaxSend;
    public String dingSendCurrency;
    public BigDecimal costEur;

    public Integer proposedPriceCents;
    public BigDecimal proposedSendValue;
    public String proposedSendCurrency;
    public Boolean proposedRange;
    public Boolean proposedActive;

    /** OK | PRECO_CORRIGIDO | RISCO_PREJUIZO | SKU_NAO_ENCONTRADO | SEM_LIMITES | SEM_CAMBIO | PRODUTO_SEM_AMOUNT */
    public String verdict;
    public String note;
}
