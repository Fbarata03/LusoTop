package com.lusotop.api.delivery;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lusotop.api.delivery.DingConnectTransferResult.ErrorKind;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.OutputStream;
import java.math.BigDecimal;
import java.net.Inet4Address;
import java.net.InetAddress;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicReference;

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
 *
 * O endpoint SendTransfer, ao contrario dos de leitura (GetBalance/GetProviders), rejeita a
 * autenticacao de forma INTERMITENTE ({"ResultCode":4,"ErrorCodes":[{"Code":"AuthenticationFailed"}]}
 * com HTTP 401) -- ora falha varias vezes seguidas, ora passa dezenas de vezes seguidas, sem
 * qualquer mudanca do nosso lado. Como esse 401 acontece ANTES de a transferencia ser criada
 * (nenhum saldo e movido, nenhum registo fica na conta), e seguro repetir o pedido. Por isso
 * {@link #sendTransfer} tenta varias vezes com backoff antes de desistir.
 */
@Service
public class DingConnectService {

    private static final Logger log = LoggerFactory.getLogger(DingConnectService.class);
    private static final Set<String> SUCCESS_STATES = Set.of("Complete", "Approved");
    // DisableFeature(FAIL_ON_UNKNOWN_PROPERTIES) -- bug real detetado em producao (order #40): um
    // pedido SendTransfer verdadeiro (nao ValidateOnly) devolveu um campo extra ("SkuCode" dentro
    // de TransferRecord) que o nosso DTO nao tinha. Por omissao o Jackson falha em campos
    // desconhecidos, o que rebentou o parsing de uma resposta que era na verdade um SUCESSO --
    // a DingConnect entregou o saldo a serio e cobrou a conta, mas o nosso codigo interpretou como
    // falha, reembolsou o cliente pela Stripe e marcou o pedido como falhado. Nunca deve voltar a
    // acontecer: ignorar campos desconhecidos e o comportamento correto para uma API externa que
    // pode adicionar campos sem aviso.
    private static final ObjectMapper MAPPER = new ObjectMapper()
            .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    private static final Duration CURL_TIMEOUT = Duration.ofSeconds(30);

    // Retentativas para o 401 intermitente do SendTransfer. Backoff linear a partir de RETRY_BASE.
    // O envio real (dinheiro em jogo) insiste mais; a validacao pre-checkout insiste menos para
    // nao deixar o utilizador a espera.
    private static final int SEND_ATTEMPTS = 5;
    private static final int VALIDATE_ATTEMPTS = 3;
    private static final long RETRY_BASE_DELAY_MS = 2000;

    // O proxy (Squid na Hetzner) chega a ligar-se a DingConnect por IPv6. A seguranca de
    // transacoes da DingConnect nao consegue atribuir o pais a esse IPv6 (ve um pseudo-IP da
    // Cloudflare em 240.0.0.0/4 -> "pais desconhecido") e rejeita o SendTransfer com
    // AuthenticationFailed, enquanto os endpoints de leitura (sem filtro de pais) passam. Para
    // forcar o caminho todo por IPv4 resolvemos o host para um A record (Cloudflare) e passamos
    // "curl --connect-to host:443:<ipv4>:443": o CONNECT do proxy passa a ser para um IPv4
    // literal, o SNI/Host continuam a ser api.dingconnect.com. IP resolvido em cache curta.
    private static final long DNS_CACHE_TTL_MS = 10 * 60 * 1000;
    private final AtomicReference<CachedIp> cachedIpv4 = new AtomicReference<>();

    private record CachedIp(String ip, long resolvedAt) {
    }

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

    /**
     * Corre a mesma validacao que o envio real (numero valido para a operadora, SKU/SendValue
     * aceites, saldo suficiente) SEM mover dinheiro. Usado antes do checkout Stripe para nunca
     * cobrar um cliente por uma recarga que a DingConnect nao vai aceitar.
     */
    public DingConnectTransferResult validateTransfer(
            String skuCode,
            BigDecimal sendValue,
            String sendCurrencyIso,
            String accountNumber,
            String distributorRef
    ) {
        return attemptWithRetry(skuCode, sendValue, sendCurrencyIso, accountNumber, distributorRef, true, VALIDATE_ATTEMPTS);
    }

    public DingConnectTransferResult sendTransfer(
            String skuCode,
            BigDecimal sendValue,
            String sendCurrencyIso,
            String accountNumber,
            String distributorRef
    ) {
        return attemptWithRetry(skuCode, sendValue, sendCurrencyIso, accountNumber, distributorRef, false, SEND_ATTEMPTS);
    }

    private DingConnectTransferResult attemptWithRetry(
            String skuCode,
            BigDecimal sendValue,
            String sendCurrencyIso,
            String accountNumber,
            String distributorRef,
            boolean validateOnly,
            int maxAttempts
    ) {
        DingConnectTransferResult last = null;
        for (int attempt = 1; attempt <= maxAttempts; attempt++) {
            last = attemptOnce(skuCode, sendValue, sendCurrencyIso, accountNumber, distributorRef, validateOnly);
            if (last.success() || !last.retryable()) {
                return last;
            }
            if (attempt < maxAttempts) {
                long delay = RETRY_BASE_DELAY_MS * attempt;
                log.warn("DingConnect {} tentativa {}/{} falhou (transitorio) para sku={} ref={}: {} -- a repetir em {}ms",
                        validateOnly ? "validateTransfer" : "sendTransfer",
                        attempt, maxAttempts, skuCode, distributorRef, last.errorMessage(), delay);
                sleep(delay);
            }
        }
        log.error("DingConnect {} esgotou {} tentativas para sku={} ref={}: {}",
                validateOnly ? "validateTransfer" : "sendTransfer",
                maxAttempts, skuCode, distributorRef, last != null ? last.errorMessage() : "sem resultado");
        return last;
    }

    private DingConnectTransferResult attemptOnce(
            String skuCode,
            BigDecimal sendValue,
            String sendCurrencyIso,
            String accountNumber,
            String distributorRef,
            boolean validateOnly
    ) {
        // A DingConnect espera o AccountNumber so com digitos (sem "+", espacos ou outros
        // caracteres) -- guardamos o numero no formato +244... para exibicao, mas enviamos aqui
        // so os digitos.
        String cleanAccountNumber = accountNumber == null ? null : accountNumber.replaceAll("[^0-9]", "");

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("SkuCode", skuCode);
        body.put("SendValue", sendValue);
        body.put("SendCurrencyIso", sendCurrencyIso);
        body.put("AccountNumber", cleanAccountNumber);
        body.put("DistributorRef", distributorRef);
        body.put("ValidateOnly", validateOnly);

        try {
            String jsonBody = MAPPER.writeValueAsString(body);
            CurlResult result = executeCurl("/api/V1/SendTransfer", jsonBody);

            if (result.exitCode() != 0) {
                // curl nao conseguiu sequer completar o pedido (proxy em baixo, timeout, DNS...).
                // Nada foi processado do lado da DingConnect -> seguro repetir.
                log.error("curl falhou (exit {}) ao chamar DingConnect SendTransfer para sku={} ref={}: {}",
                        result.exitCode(), skuCode, distributorRef, result.output());
                return DingConnectTransferResult.failure(
                        truncate("Erro de comunicacao com a DingConnect (curl exit " + result.exitCode() + ")"),
                        ErrorKind.SERVICE_UNAVAILABLE
                );
            }

            if (result.statusCode() < 200 || result.statusCode() >= 300) {
                ErrorKind kind = classifyHttpStatus(result.statusCode(), result.body());
                log.error("DingConnect SendTransfer devolveu HTTP {} ({}) para sku={} ref={}: {}",
                        result.statusCode(), kind, skuCode, distributorRef, result.body());
                return DingConnectTransferResult.failure(
                        truncate("Erro de comunicacao com a DingConnect: " + result.statusCode() + " " + result.body()),
                        kind
                );
            }

            SendTransferResponse response = MAPPER.readValue(result.body(), SendTransferResponse.class);

            boolean success = response.resultCode() == 1
                    && response.transferRecord() != null
                    && SUCCESS_STATES.contains(response.transferRecord().processingState());

            if (success) {
                return DingConnectTransferResult.success(
                        response.transferRecord().transferId() != null
                                ? response.transferRecord().transferId().transferRef() : null,
                        response.transferRecord().processingState()
                );
            }

            List<String> codes = response.errorCodes() == null ? List.of()
                    : response.errorCodes().stream().map(DingConnectError::code).filter(c -> c != null).toList();
            ErrorKind kind = classifyErrorCodes(codes, response.transferRecord());

            if (kind == ErrorKind.ALREADY_SENT) {
                log.warn("DingConnect SendTransfer: DistributorRef {} ja usado -- transferencia anterior considerada entregue.", distributorRef);
                return DingConnectTransferResult.alreadySent();
            }

            String errorSummary = codes.isEmpty()
                    ? "Estado: " + (response.transferRecord() != null ? response.transferRecord().processingState() : "desconhecido")
                    : String.join(", ", codes);
            log.error("DingConnect SendTransfer sem sucesso ({}) para sku={} ref={}: {}", kind, skuCode, distributorRef, errorSummary);
            return DingConnectTransferResult.failure(truncate(errorSummary), kind);
        } catch (Exception e) {
            // Excecao inesperada (parsing, IO) -- tratar como transitorio; a rede pode ter caido a meio.
            log.error("Erro ao chamar DingConnect SendTransfer para sku={} ref={}", skuCode, distributorRef, e);
            return DingConnectTransferResult.failure(
                    truncate("Erro de comunicacao com a DingConnect: " + e.getMessage()),
                    ErrorKind.SERVICE_UNAVAILABLE
            );
        }
    }

    private ErrorKind classifyHttpStatus(int status, String body) {
        String lower = body == null ? "" : body.toLowerCase(Locale.ROOT);
        // O 401 "AuthenticationFailed" do SendTransfer e intermitente e acontece antes de a
        // transferencia ser criada -> transitorio, deve ser repetido.
        if (status == 401 || status == 403 || status == 408 || status == 429 || status >= 500) {
            return ErrorKind.SERVICE_UNAVAILABLE;
        }
        if (lower.contains("accountnumber") || lower.contains("account number") || lower.contains("invalidaccount")) {
            return ErrorKind.INVALID_ACCOUNT;
        }
        if (lower.contains("insufficient") || lower.contains("balance")) {
            return ErrorKind.INSUFFICIENT_FLOAT;
        }
        if (lower.contains("sku") || lower.contains("sendvalue") || lower.contains("sendcurrency")
                || lower.contains("parametercombination") || lower.contains("product")) {
            return ErrorKind.INVALID_PRODUCT;
        }
        return ErrorKind.UNKNOWN;
    }

    private ErrorKind classifyErrorCodes(List<String> codes, TransferRecord record) {
        String joined = String.join(" ", codes).toLowerCase(Locale.ROOT);
        if (joined.contains("authenticationfailed") || joined.contains("unavailable") || joined.contains("timeout")) {
            return ErrorKind.SERVICE_UNAVAILABLE;
        }
        if (joined.contains("distributorref") || joined.contains("alreadyused") || joined.contains("duplicate")) {
            return ErrorKind.ALREADY_SENT;
        }
        if (joined.contains("account")) {
            return ErrorKind.INVALID_ACCOUNT;
        }
        if (joined.contains("insufficient") || joined.contains("float") || joined.contains("balance")) {
            return ErrorKind.INSUFFICIENT_FLOAT;
        }
        if (joined.contains("sku") || joined.contains("sendvalue") || joined.contains("sendcurrency")
                || joined.contains("parametercombination") || joined.contains("product")) {
            return ErrorKind.INVALID_PRODUCT;
        }
        // Sem codigos mas com um TransferRecord em estado terminal de falha -> falha real da operadora.
        if (codes.isEmpty() && record != null && record.processingState() != null
                && (record.processingState().equalsIgnoreCase("Failed")
                || record.processingState().equalsIgnoreCase("Declined"))) {
            return ErrorKind.INVALID_ACCOUNT;
        }
        return ErrorKind.UNKNOWN;
    }

    private void sleep(long millis) {
        try {
            Thread.sleep(millis);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    private String hostOf(String url) {
        try {
            return URI.create(url).getHost();
        } catch (Exception e) {
            return null;
        }
    }

    /** IPv4 (A record) do host da DingConnect, com cache curta. null se nao houver forma de resolver. */
    private String resolveIpv4(String host) {
        if (host == null) return null;
        CachedIp cached = cachedIpv4.get();
        long now = System.currentTimeMillis();
        if (cached != null && cached.ip() != null && now - cached.resolvedAt() < DNS_CACHE_TTL_MS) {
            return cached.ip();
        }
        try {
            String ip = Arrays.stream(InetAddress.getAllByName(host))
                    .filter(a -> a instanceof Inet4Address)
                    .map(a -> a.getHostAddress())
                    .findFirst()
                    .orElse(null);
            cachedIpv4.set(new CachedIp(ip, now));
            return ip;
        } catch (Exception e) {
            log.warn("Não foi possível resolver IPv4 de {} para forçar o caminho IPv4 da DingConnect", host, e);
            cachedIpv4.set(new CachedIp(cached != null ? cached.ip() : null, now));
            return cached != null ? cached.ip() : null;
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
        // Forca o pedido (incluindo o salto proxy -> DingConnect) a sair por IPv4 -- ver nota em
        // cachedIpv4. Se a resolucao falhar, segue sem --connect-to (melhor tentar do que abortar).
        String host = hostOf(baseUrl);
        String ipv4 = resolveIpv4(host);
        if (ipv4 != null) {
            command.add("--connect-to");
            command.add(host + ":443:" + ipv4 + ":443");
        }
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
