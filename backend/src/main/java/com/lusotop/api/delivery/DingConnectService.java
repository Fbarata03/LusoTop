package com.lusotop.api.delivery;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.apache.hc.client5.http.auth.AuthScope;
import org.apache.hc.client5.http.auth.CredentialsStore;
import org.apache.hc.client5.http.auth.UsernamePasswordCredentials;
import org.apache.hc.client5.http.impl.auth.BasicCredentialsProvider;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.HttpClientBuilder;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.client5.http.impl.routing.DefaultProxyRoutePlanner;
import org.apache.hc.core5.http.HttpHost;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
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

    public DingConnectService(
            @Value("${app.dingconnect.base-url}") String baseUrl,
            @Value("${app.dingconnect.proxy-url:}") String proxyUrl
    ) {
        HttpClientBuilder httpClientBuilder = HttpClients.custom();

        // A DingConnect exige que os pedidos de producao venham de um IP autorizado
        // (whitelist obrigatoria, confirmado pelo suporte deles) -- o Render nao tem IP fixo,
        // por isso as chamadas passam por um proxy dedicado (servidor com IP fixo) quando
        // DINGCONNECT_PROXY_URL esta definido. Sem isso, liga-se diretamente (ex: dev local).
        //
        // Usa-se o Apache HttpClient em vez do java.net.http.HttpClient nativo do Java: este
        // ultimo, quando tem um Authenticator configurado (necessario para autenticar o tunel
        // HTTPS via proxy), intercepta TAMBEM as respostas 401 do servidor de destino e rebenta
        // com "WWW-Authenticate header missing" se esse cabecalho nao vier -- e a DingConnect nao
        // o envia. O Apache HttpClient associa as credenciais do proxy apenas ao AuthScope do
        // proxy (via CredentialsProvider), sem nenhum efeito sobre respostas do servidor de
        // destino.
        if (proxyUrl != null && !proxyUrl.isBlank()) {
            URI proxy = URI.create(proxyUrl);
            HttpHost proxyHost = new HttpHost("http", proxy.getHost(), proxy.getPort());
            // setProxy() por si so demonstrou nao ser fiavel em producao -- um pedido real
            // (order #30) confirmou-se, pelo IP devolvido na pagina de bloqueio da Cloudflare,
            // ter saido diretamente via IPv6 do Render, sem passar pelo proxy. Definir o
            // RoutePlanner explicitamente elimina qualquer ambiguidade no fallback interno do
            // builder.
            httpClientBuilder.setRoutePlanner(new DefaultProxyRoutePlanner(proxyHost));

            String[] userInfo = proxy.getUserInfo() != null ? proxy.getUserInfo().split(":", 2) : null;
            if (userInfo != null && userInfo.length == 2) {
                String proxyUser = URLDecoder.decode(userInfo[0], StandardCharsets.UTF_8);
                String proxyPassword = URLDecoder.decode(userInfo[1], StandardCharsets.UTF_8);
                CredentialsStore credentialsStore = new BasicCredentialsProvider();
                credentialsStore.setCredentials(
                        new AuthScope(proxyHost),
                        new UsernamePasswordCredentials(proxyUser, proxyPassword.toCharArray())
                );
                httpClientBuilder.setDefaultCredentialsProvider(credentialsStore);
            }
            log.info("DingConnectService: a encaminhar pedidos atraves do proxy {}:{}", proxy.getHost(), proxy.getPort());
        }

        CloseableHttpClient httpClient = httpClientBuilder.build();

        // O dominio da DingConnect esta atras da Cloudflare, que bloqueia com 403 pedidos sem
        // User-Agent de browser (o mesmo aconteceu ao buscar os logos das operadoras).
        this.restClient = RestClient.builder()
                .baseUrl(baseUrl)
                .requestFactory(new HttpComponentsClientHttpRequestFactory(httpClient))
                .defaultHeader("User-Agent", "Mozilla/5.0 (compatible; LusoTop/1.0)")
                .build();
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
            return DingConnectTransferResult.failure(truncate(errorSummary));
        } catch (Exception e) {
            log.error("Erro ao chamar DingConnect SendTransfer para sku={} distributorRef={}", skuCode, distributorRef, e);
            return DingConnectTransferResult.failure(truncate("Erro de comunicacao com a DingConnect: " + e.getMessage()));
        }
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
