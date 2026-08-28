package com.lusotop.api.email;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Envio de email transacional via Resend (https://resend.com). Sem dominio verificado na Resend,
 * so e possivel enviar para o proprio email da conta (modo sandbox) -- ver RESEND_FROM.
 */
@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final RestClient restClient;
    private final String apiKey;
    private final String from;

    public EmailService(
            @Value("${app.resend.api-key}") String apiKey,
            @Value("${app.resend.from}") String from
    ) {
        this.apiKey = apiKey;
        this.from = from;
        this.restClient = RestClient.builder()
                .baseUrl("https://api.resend.com")
                .build();
    }

    public boolean send(String to, String subject, String htmlBody) {
        return send(to, subject, htmlBody, null, null);
    }

    public boolean send(String to, String subject, String htmlBody, String attachmentFilename, byte[] attachmentBytes) {
        if (apiKey == null || apiKey.isBlank()) {
            log.warn("RESEND_API_KEY nao configurada -- email para {} nao foi enviado.", to);
            return false;
        }
        try {
            Map<String, Object> body = new LinkedHashMap<>();
            body.put("from", from);
            body.put("to", to);
            body.put("subject", subject);
            body.put("html", htmlBody);
            if (attachmentFilename != null && attachmentBytes != null) {
                body.put("attachments", List.of(Map.of(
                        "filename", attachmentFilename,
                        "content", Base64.getEncoder().encodeToString(attachmentBytes)
                )));
            }

            restClient.post()
                    .uri("/emails")
                    .header("Authorization", "Bearer " + apiKey)
                    .contentType(org.springframework.http.MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .toBodilessEntity();
            return true;
        } catch (Exception e) {
            log.error("Falha ao enviar email para {}", to, e);
            return false;
        }
    }
}
