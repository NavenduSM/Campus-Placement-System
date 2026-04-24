package com.example.Tpo_Service.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Component
public class OfferPdfGenerator {

    @Value("${app.offer.upload-dir:${user.home}/uploads/offer-pdfs}")
    private String uploadDir;

    public Path saveGeneratedOfferPdf(Long studentId,
                                      String studentName,
                                      String enrollmentNo,
                                      String companyName,
                                      String offerDetails) throws IOException {
        Path directory = Paths.get(uploadDir);
        Files.createDirectories(directory);

        String safeStudent = sanitize(studentName != null ? studentName : String.valueOf(studentId));
        String safeCompany = sanitize(companyName);
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String fileName = String.format("offer-%s-%s-%s.pdf", safeStudent, safeCompany, timestamp);
        Path pdfPath = directory.resolve(fileName);

        Files.write(pdfPath, buildOfferPdf(studentName, enrollmentNo, companyName, offerDetails));
        return pdfPath;
    }

    private byte[] buildOfferPdf(String studentName, String enrollmentNo, String companyName, String offerDetails) {
        List<String> lines = new ArrayList<>();
        lines.add("");
        lines.add("Student Name: " + safeValue(studentName));
        lines.add("Enrollment No: " + safeValue(enrollmentNo));
        lines.add("Company Name: " + safeValue(companyName));
        lines.add("");
        lines.add("Offer Details:");
        lines.addAll(wrapText(safeValue(offerDetails), 90));
        lines.add("");
        lines.add("Generated On: " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a")));
        lines.add("");
        lines.add("This letter has been issued digitally by the Training and Placement Office.");

        byte[] contentStream = buildContentStream(lines).getBytes(StandardCharsets.US_ASCII);

        String object1 = "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n";
        String object2 = "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n";
        String object3 = "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n";
        String object4 = "4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n";
        String object5 = "5 0 obj\n<< /Length " + contentStream.length + " >>\nstream\n";
        String object5End = "\nendstream\nendobj\n";

        try (ByteArrayOutputStream output = new ByteArrayOutputStream()) {
            output.write("%PDF-1.4\n".getBytes(StandardCharsets.US_ASCII));

            int offset1 = output.size();
            output.write(object1.getBytes(StandardCharsets.US_ASCII));
            int offset2 = output.size();
            output.write(object2.getBytes(StandardCharsets.US_ASCII));
            int offset3 = output.size();
            output.write(object3.getBytes(StandardCharsets.US_ASCII));
            int offset4 = output.size();
            output.write(object4.getBytes(StandardCharsets.US_ASCII));
            int offset5 = output.size();
            output.write(object5.getBytes(StandardCharsets.US_ASCII));
            output.write(contentStream);
            output.write(object5End.getBytes(StandardCharsets.US_ASCII));

            int xrefStart = output.size();
            StringBuilder xref = new StringBuilder();
            xref.append("xref\n");
            xref.append("0 6\n");
            xref.append("0000000000 65535 f \n");
            xref.append(formatOffset(offset1)).append(" 00000 n \n");
            xref.append(formatOffset(offset2)).append(" 00000 n \n");
            xref.append(formatOffset(offset3)).append(" 00000 n \n");
            xref.append(formatOffset(offset4)).append(" 00000 n \n");
            xref.append(formatOffset(offset5)).append(" 00000 n \n");
            xref.append("trailer\n");
            xref.append("<< /Size 6 /Root 1 0 R >>\n");
            xref.append("startxref\n");
            xref.append(xrefStart).append('\n');
            xref.append("%%EOF");

            output.write(xref.toString().getBytes(StandardCharsets.US_ASCII));
            return output.toByteArray();
        } catch (IOException ex) {
            throw new IllegalStateException("Unable to build offer PDF", ex);
        }
    }

    private String buildContentStream(List<String> lines) {
        StringBuilder content = new StringBuilder();
        content.append("BT\n");
        content.append("/F1 18 Tf\n");
        content.append("72 780 Td\n");
        content.append("22 TL\n");
        content.append("(JIMS Training and Placement Office) Tj\n");
        content.append("T*\n");
        content.append("/F1 16 Tf\n");
        content.append("18 TL\n");
        content.append("(Offer Letter) Tj\n");
        content.append("T*\n");
        content.append("/F1 12 Tf\n");
        content.append("14 TL\n");

        for (String line : lines) {
            if (line.isBlank()) {
                content.append("T*\n");
                continue;
            }
            content.append('(').append(escapePdf(line)).append(") Tj\n");
            content.append("T*\n");
        }

        content.append("ET\n");
        return content.toString();
    }

    private List<String> wrapText(String text, int maxLength) {
        List<String> wrapped = new ArrayList<>();
        if (text == null || text.isBlank()) {
            wrapped.add("Not specified");
            return wrapped;
        }

        String[] paragraphs = text.split("\\R");
        for (String paragraph : paragraphs) {
            String trimmed = paragraph.trim();
            if (trimmed.isEmpty()) {
                wrapped.add("");
                continue;
            }

            String remaining = trimmed;
            while (remaining.length() > maxLength) {
                int breakPoint = remaining.lastIndexOf(' ', maxLength);
                if (breakPoint <= 0) {
                    breakPoint = maxLength;
                }
                wrapped.add(remaining.substring(0, breakPoint).trim());
                remaining = remaining.substring(breakPoint).trim();
            }
            if (!remaining.isEmpty()) {
                wrapped.add(remaining);
            }
        }
        return wrapped;
    }

    private String safeValue(String value) {
        return value == null || value.isBlank() ? "Not specified" : value.trim();
    }

    private String sanitize(String value) {
        String sanitized = safeValue(value).toLowerCase().replaceAll("[^a-z0-9]+", "-");
        sanitized = sanitized.replaceAll("^-+|-+$", "");
        return sanitized.isBlank() ? "offer" : sanitized;
    }

    private String escapePdf(String text) {
        return text
            .replace("\\", "\\\\")
            .replace("(", "\\(")
            .replace(")", "\\)");
    }

    private String formatOffset(int offset) {
        return String.format("%010d", offset);
    }
}
