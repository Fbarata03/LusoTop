package com.lusotop.api.order;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDFont;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * Gera o comprovativo em PDF de uma recarga entregue com sucesso. E puramente informativo --
 * nao substitui nenhuma fatura fiscal (ver aviso no proprio documento).
 */
@Service
public class ReceiptService {

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy").withZone(ZoneOffset.UTC);
    private static final DateTimeFormatter TIME_FMT = DateTimeFormatter.ofPattern("HH:mm 'UTC'").withZone(ZoneOffset.UTC);

    public byte[] generate(Order order) {
        try (PDDocument document = new PDDocument()) {
            PDPage page = new PDPage(PDRectangle.A4);
            document.addPage(page);

            PDFont regular = new PDType1Font(Standard14Fonts.FontName.HELVETICA);
            PDFont bold = new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);

            float margin = 60;
            float y = PDRectangle.A4.getHeight() - margin;
            float lineHeight = 18;

            try (PDPageContentStream cs = new PDPageContentStream(document, page)) {
                y = writeLine(cs, bold, 20, margin, y, "LusoTop");
                y -= 6;
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

                y -= lineHeight;
                y = writeLine(cs, regular, 9, margin,
                        y, "Comprovativo informativo — não é uma fatura fiscal.");
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            document.save(out);
            return out.toByteArray();
        } catch (IOException e) {
            throw new UncheckedIOException("Falha ao gerar comprovativo PDF para o pedido " + order.getId(), e);
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
