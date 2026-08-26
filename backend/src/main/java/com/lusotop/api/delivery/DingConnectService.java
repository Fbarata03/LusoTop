package com.lusotop.api.delivery;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Envio real de recarga via DingConnect (SendTransfer). A API espera/devolve campos em
 * PascalCase (ver GetProviders/GetProducts), diferente da convencao camelCase do resto do
 * projeto -- por isso os DTOs aqui usam @JsonProperty explicito.
 */
@Service
public class DingConnectService {

    private static final Logger log = LoggerFactory.getLogger(DingConnectService.class);
    private static final Set<String> SUCCESS_STATES = Set.of("Complete", "Approved");

    private final RestClient restClient;

    @Value("${app.dingconnect.api-key}")
    private String apiKey;

    public DingConnectService(@Value("${app.dingconnect.base-url}") String baseUrl) {
        this.restClient = RestClient.builder().baseUrl(baseUrl).build();
    }

    public DingConnectTransferResult sendTransfer(
            String skuCode,
            BigDecimal sendValue,
            String sendCurrencyIso,
            String accountNumber,
            String distributorRef
    ) {
        Map<String, Object> body = Map.of(
                "SkuCode", skuCode,
                "SendValue", sendValue,
                "SendCurrencyIso", sendCurrencyIso,
                "AccountNumber", accountNumber,
                "DistributorRef", distributorRef,
                "ValidateOnly", false
        );

        try {
            SendTransferResponse response = restClient.post()
                    .uri("/api/V1/SendTransfer")
                    .header("api_key", apiKey)
                    .contentType(org.springframework.http.MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .body(SendTransferResponse.class);

            if (response == null) {
                return DingConnectTransferResult.failure("Resposta vazia da DingConnect.");
            }

            boolean success = response.resultCode() == 1
                    && response.transferRecord() != null
                    && SUCCESS_STATES.contains(response.transferRecord().processingState());

            if (success) {
                return DingConnectTransferResult.success(
                        response.transferRecord().transferId().transferRef(),
                        response.transferRecord().processingState()
                );
            }

            String errorSummary = response.errorCodes() == null || response.errorCodes().isEmpty()
                    ? "Estado: " + (response.transferRecord() != null ? response.transferRecord().processingState() : "desconhecido")
                    : response.errorCodes().stream().map(DingConnectError::code).reduce((a, b) -> a + ", " + b).orElse("erro desconhecido");
            log.error("DingConnect SendTransfer nao teve sucesso para sku={} distributorRef={}: {}", skuCode, distributorRef, errorSummary);
            return DingConnectTransferResult.failure(errorSummary);
        } catch (Exception e) {
            log.error("Erro ao chamar DingConnect SendTransfer para sku={} distributorRef={}", skuCode, distributorRef, e);
            return DingConnectTransferResult.failure("Erro de comunicacao com a DingConnect: " + e.getMessage());
        }
    }

    private record SendTransferResponse(
            @JsonProperty("TransferRecord") TransferRecord transferRecord,
            @JsonProperty("ResultCode") int resultCode,
            @JsonProperty("ErrorCodes") List<DingConnectError> errorCodes
    ) {
    }

    private record TransferRecord(
            @JsonProperty("TransferId") TransferId transferId,
            @JsonProperty("ProcessingState") String processingState
    ) {
    }

    private record TransferId(
            @JsonProperty("TransferRef") String transferRef,
            @JsonProperty("DistributorRef") String distributorRef
    ) {
    }

    private record DingConnectError(
            @JsonProperty("Code") String code,
            @JsonProperty("Context") String context
    ) {
    }
}
