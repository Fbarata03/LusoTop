package com.lusotop.api.catalog;

import java.util.List;

/**
 * Resultado de uma auditoria ({@code applied=false}) ou sincronização ({@code applied=true}) do
 * catálogo local contra o GetProducts da DingConnect.
 */
public record CatalogAuditReport(
        boolean applied,
        int dingConnectProducts,
        int localProductsChecked,
        int updated,
        int deactivated,
        List<CatalogAuditRow> rows
) {
}
