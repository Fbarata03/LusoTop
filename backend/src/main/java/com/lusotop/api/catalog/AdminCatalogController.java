package com.lusotop.api.catalog;

import com.lusotop.api.common.BadRequestException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Endpoints de admin para sincronizar os preços/custos do catálogo com o catálogo real da
 * DingConnect. Protegido por {@code /api/admin/**} → ROLE_ADMIN (ver SecurityConfig).
 */
@RestController
@RequestMapping("/api/admin/catalog")
public class AdminCatalogController {

    private final CatalogSyncService catalogSyncService;

    public AdminCatalogController(CatalogSyncService catalogSyncService) {
        this.catalogSyncService = catalogSyncService;
    }

    /** Só lê: mostra o que mudaria, sem escrever nada. */
    @GetMapping("/audit")
    public CatalogAuditReport audit() {
        return catalogSyncService.audit();
    }

    /** Resposta bruta do GetProducts da DingConnect (para inspeção antes de sincronizar). */
    @GetMapping(value = "/dingconnect-raw", produces = "text/plain")
    public String dingConnectRaw() {
        return catalogSyncService.rawDingConnectCatalog();
    }

    /** Aplica as correções. Exige {@code ?confirm=true} para evitar disparos acidentais. */
    @PostMapping("/resync")
    public CatalogAuditReport resync(@RequestParam(defaultValue = "false") boolean confirm) {
        if (!confirm) {
            throw new BadRequestException("CONFIRM_REQUIRED",
                    "Confirma com ?confirm=true. Corre primeiro GET /api/admin/catalog/audit e revê o relatório.");
        }
        return catalogSyncService.resync();
    }
}
