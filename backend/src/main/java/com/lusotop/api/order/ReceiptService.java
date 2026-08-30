package com.lusotop.api.order;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDFont;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.UncheckedIOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * Gera o comprovativo em PDF de uma recarga entregue com sucesso. E puramente informativo --
 * nao substitui nenhuma fatura fiscal (ver aviso no proprio documento).
 */
@Service
public class ReceiptService {

    private static final Logger log = LoggerFactory.getLogger(ReceiptService.class);
    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy").withZone(ZoneOffset.UTC);
    private static final DateTimeFormatter TIME_FMT = DateTimeFormatter.ofPattern("HH:mm 'UTC'").withZone(ZoneOffset.UTC);
    private static final String LUSOTOP_LOGO_RESOURCE = "/branding/lusotop-logo.png";

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(5))
            .build();

    public byte[] generate(Order order) {
        try (PDDocument document = new PDDocument()) {
            PDPage page = new PDPage(PDRectangle.A4);
            document.addPage(page);

            PDFont regular = new PDType1Font(Standard14Fonts.FontName.HELVETICA);
            PDFont bold = new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);

            float margin = 60;
            float pageWidth = PDRectangle.A4.getWidth();
            float y = PDRectangle.A4.getHeight() - margin;
            float lineHeight = 18;
            float logoSize = 42;

            try (PDPageContentStream cs = new PDPageContentStream(document, page)) {
                float headerTop = y;

                PDImageXObject lusotopLogo = loadClasspathImage(document, LUSOTOP_LOGO_RESOURCE);
                float titleX = margin;
                if (lusotopLogo != null) {
                    cs.drawImage(lusotopLogo, margin, headerTop - logoSize, logoSize, logoSize);
                    titleX = margin + logoSize + 10;
                }
                writeLine(cs, bold, 20, titleX, headerTop - logoSize / 2f + 7, "LusoTop");

                PDImageXObject operatorLogo = loadOperatorLogo(document, order.getOperator());
                if (operatorLogo != null) {
                    float maxW = 90, maxH = 32;
                    float scale = Math.min(1f, Math.min(maxW / operatorLogo.getWidth(), maxH / operatorLogo.getHeight()));
                    float w = operatorLogo.getWidth() * scale;
                    float h = operatorLogo.getHeight() * scale;
                    cs.drawImage(operatorLogo, pageWidth - margin - w, headerTop - logoSize / 2f - h / 2f, w, h);
                }

                y = headerTop - logoSize - 6;
                y = writeLine(cs, regular, 11, margin, y, "Comprovativo de recarga");
                y -= lineHeight;

                List<String[]> rows = List.of(
                        new String[]{"Cliente", order.getUser() != null ? order.getUser().getName() : "-"},
                        new String[]{"Email", order.getUser() != null ? order.getUser().getEmail() : "-"},
                        new String[]{"Número recarregado", order.getPhoneNumber()},
                        new String[]{"País", order.getCountry().getName()},
                        new String[]{"Operadora", order.getOperator().getName()},
                        new String[]{"Valor pago", order.getPayerAmount() + " " + order.getPayerCurrency()},
                        new String[]{"Data", DATE_FMT.format(order.getCreatedAt())},
                        new String[]{"Hora", TIME_FMT.format(order.getCreatedAt())},
                        new String[]{"ID da encomenda", "LT-" + order.getId()},
                        new String[]{"ID do pagamento (Stripe)", nullToDash(order.getStripePaymentIntentId())},
                        new String[]{"ID da transação (DingConnect)", nullToDash(order.getDingconnectTransferRef())},
                        new String[]{"Estado da recarga", "Concluída com sucesso"}
                );

                for (String[] row : rows) {
                    y = writeLine(cs, bold, 10, margin, y, row[0] + ":");
                    y = writeLine(cs, regular, 10, margin + 170, y + lineHeight, row[1]);
                    y -= lineHeight;
                }
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            document.save(out);
            return out.toByteArray();
        } catch (IOException e) {
            throw new UncheckedIOException("Falha ao gerar comprovativo PDF para o pedido " + order.getId(), e);
        }
    }

    /**
     * Logo da operadora para o comprovativo. Tenta primeiro o ficheiro empacotado em
     * {@code /branding/operators/{CODE}.png} (sempre disponivel, mesmo sem rede) e so
     * depois recorre ao CDN da DingConnect.
     */
    private PDImageXObject loadOperatorLogo(PDDocument document, com.lusotop.api.operator.Operator operator) {
        if (operator == null) return null;
        if (operator.getCode() != null && !operator.getCode().isBlank()) {
            PDImageXObject bundled = loadClasspathImage(document, "/branding/operators/" + operator.getCode() + ".png");
            if (bundled != null) return bundled;
        }
        return loadRemoteImage(document, operator.getLogoUrl());
    }

    private PDImageXObject loadClasspathImage(PDDocument document, String resourcePath) {
        try (InputStream in = getClass().getResourceAsStream(resourcePath)) {
            if (in == null) return null;
            return PDImageXObject.createFromByteArray(document, in.readAllBytes(), resourcePath);
        } catch (IOException e) {
            log.warn("Não foi possível carregar o logo {} para o comprovativo", resourcePath, e);
            return null;
        }
    }

    private PDImageXObject loadRemoteImage(PDDocument document, String url) {
        if (url == null || url.isBlank()) return null;
        try {
            // O CDN da DingConnect (Cloudflare) bloqueia pedidos sem User-Agent de browser (403).
            HttpRequest request = HttpRequest.newBuilder(URI.create(url))
                    .timeout(Duration.ofSeconds(5))
                    .header("User-Agent", "Mozilla/5.0 (compatible; LusoTop/1.0)")
                    .GET()
                    .build();
            HttpResponse<byte[]> response = httpClient.send(request, HttpResponse.BodyHandlers.ofByteArray());
            if (response.statusCode() != 200) return null;
            return PDImageXObject.createFromByteArray(document, response.body(), url);
        } catch (Exception e) {
            // Logo do operador e so decorativo -- se a DingConnect estiver em baixo ou o
            // formato nao for suportado, o comprovativo continua a ser gerado sem ele.
            log.warn("Não foi possível carregar o logo da operadora ({}) para o comprovativo", url, e);
            return null;
        }
    }

    private float writeLine(PDPageContentStream cs, PDFont font, float size, float x, float y, String text) throws IOException {
        cs.beginText();
        cs.setFont(font, size);
        cs.newLineAtOffset(x, y);
        cs.showText(text);
        cs.endText();
        return y - size;
    }

    private String nullToDash(String value) {
        return value == null || value.isBlank() ? "-" : value;
    }
}
