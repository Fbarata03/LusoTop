package com.lusotop.api.delivery;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.OutputStream;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.TimeUnit;

/**
 * Envio real de recarga via DingConnect (SendTransfer). A API espera/devolve campos em
 * PascalCase (ver GetProviders/GetProducts), diferente da convencao camelCase do resto do
 * projeto -- por isso os DTOs aqui usam @JsonProperty explicito.
 *
 * O pedido HTTP e feito atraves de um subprocesso curl, nao de um cliente HTTP nativo do Java
 * (java.net.http.HttpClient / Apache HttpClient). Ambos foram tentados e ambos, mesmo vindo do
 * mesmo IP whitelisted no proxy dedicado, foram bloqueados pela Cloudflare da DingConnect (403,
 * confirmado com Ray ID proprio e sem qualquer registo de transacao no backend deles -- ou seja,
 * bloqueado na borda, antes de chegar a aplicacao). A assinatura TLS/HTTP desses clientes Java e
 * reconhecivel como nao-browser pelo Bot Management da Cloudflare, independente do IP estar na
 * whitelist. O curl, com a mesma configuracao de proxy e headers, nunca falhou uma unica vez em
 * dezenas de testes diretos ao mesmo endpoint -- por isso usa-se aqui tambem.
 */
@Service
public class DingConnectService {

    private static final Logger log = LoggerFactory.getLogger(DingConnectService.class);
    private static final Set<String> SUCCESS_STATES = Set.of("Complete", "Approved");
    private static final ObjectMapper MAPPER = new ObjectMapper();
    private static final Duration CURL_TIMEOUT = Duration.ofSeconds(30);

    private final String baseUrl;
    private final String proxyUrl;

    @Value("${app.dingconnect.api-key}")
    private String apiKey;

    public DingConnectService(
            @Value("${app.dingconnect.base-url}") String baseUrl,
            @Value("${app.dingconnect.proxy-url:}") String proxyUrl
    ) {
        this.baseUrl = baseUrl;
        this.proxyUrl = (proxyUrl != null && !proxyUrl.isBlank()) ? proxyUrl : null;
        if (this.proxyUrl != null) {
            log.info("DingConnectService: a encaminhar pedidos atraves do proxy configurado (curl -x).");
        }
    }

    public DingConnectTransferResult sendTransfer(
            String skuCode,
            BigDecimal sendValue,
            String sendCurrencyIso,
            String accountNumber,
            String distributorRef
    ) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("SkuCode", skuCode);
        body.put("SendValue", sendValue);
        body.put("SendCurrencyIso", sendCurrencyIso);
        body.put("AccountNumber", accountNumber);
        body.put("DistributorRef", distributorRef);
        body.put("ValidateOnly", false);

        try {
            String jsonBody = MAPPER.writeValueAsString(body);
            CurlResult result = executeCurl("/api/V1/SendTransfer", jsonBody);

            if (result.exitCode() != 0) {
                log.error("curl falhou (exit {}) ao chamar DingConnect SendTransfer para sku={} distributorRef={}: {}",
                        result.exitCode(), skuCode, distributorRef, result.output());
                return DingConnectTransferResult.failure(
                        truncate("Erro de comunicacao com a DingConnect (curl exit " + result.exitCode() + "): " + result.output())
                );
            }

            if (result.statusCode() < 200 || result.statusCode() >= 300) {
                log.error("DingConnect SendTransfer devolveu HTTP {} para sku={} distributorRef={}: {}",
                        result.statusCode(), skuCode, distributorRef, result.body());
                return DingConnectTransferResult.failure(
                        truncate("Erro de comunicacao com a DingConnect: " + result.statusCode() + " " + result.body())
                );
            }

            SendTransferResponse response = MAPPER.readValue(result.body(), SendTransferResponse.class);

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
            return DingConnectTransferResult.failure(truncate(errorSummary));
        } catch (Exception e) {
            log.error("Erro ao chamar DingConnect SendTransfer para sku={} distributorRef={}", skuCode, distributorRef, e);
            return DingConnectTransferResult.failure(truncate("Erro de comunicacao com a DingConnect: " + e.getMessage()));
        }
    }

    private CurlResult executeCurl(String path, String jsonBody) throws Exception {
        List<String> command = new ArrayList<>();
        command.add("curl");
        command.add("-s");
        command.add("-S");
        command.add("-4");
        command.add("--max-time");
        command.add("25");
        command.add("-w");
        command.add("\n%{http_code}");
        command.add("-X");
        command.add("POST");
        command.add(baseUrl + path);
        command.add("-H");
        command.add("User-Agent: Mozilla/5.0 (compatible; LusoTop/1.0)");
        command.add("-H");
        command.add("Content-Type: application/json");
        command.add("-H");
        command.add("api_key: " + apiKey);
        if (proxyUrl != null) {
            command.add("-x");
            command.add(proxyUrl);
        }
        command.add("--data-binary");
        command.add("@-");

        ProcessBuilder processBuilder = new ProcessBuilder(command).redirectErrorStream(true);
        Process process = processBuilder.start();
        try (OutputStream stdin = process.getOutputStream()) {
            stdin.write(jsonBody.getBytes(StandardCharsets.UTF_8));
        }
        String output = new String(process.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
        boolean finished = process.waitFor(CURL_TIMEOUT.toSeconds(), TimeUnit.SECONDS);
        if (!finished) {
            process.destroyForcibly();
            return new CurlResult(-1, -1, "timeout ao aguardar pelo curl", output);
        }

        int exitCode = process.exitValue();
        if (exitCode != 0) {
            return new CurlResult(exitCode, -1, output, output);
        }

        int lastNewline = output.lastIndexOf('\n');
        String responseBody = lastNewline >= 0 ? output.substring(0, lastNewline) : "";
        String statusText = (lastNewline >= 0 ? output.substring(lastNewline + 1) : output).trim();
        int statusCode;
        try {
            statusCode = Integer.parseInt(statusText);
        } catch (NumberFormatException e) {
            return new CurlResult(exitCode, -1, "resposta inesperada do curl: " + output, output);
        }
        return new CurlResult(exitCode, statusCode, responseBody, output);
    }

    private record CurlResult(int exitCode, int statusCode, String body, String output) {
    }

    // orders.delivery_error e VARCHAR(500) -- uma resposta inesperada (ex: pagina de bloqueio da
    // Cloudflare em vez de JSON) pode ser muito maior do que isso e rebentar o proprio UPDATE,
    // desfazendo toda a transacao (incluindo o reembolso automatico que devia acontecer a seguir).
    private static final int MAX_ERROR_LENGTH = 450;

    private String truncate(String message) {
        if (message == null) return null;
        return message.length() > MAX_ERROR_LENGTH ? message.substring(0, MAX_ERROR_LENGTH) + "…" : message;
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
