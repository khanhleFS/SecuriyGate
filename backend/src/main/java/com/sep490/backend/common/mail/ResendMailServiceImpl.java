package com.sep490.backend.common.mail;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
@ConditionalOnProperty(name = "app.mail.provider", havingValue = "resend")
public class ResendMailServiceImpl implements MailService {

    private final RestClient restClient;
    private final TemplateEngine templateEngine;

    @Value("${app.resend.api-key:}")
    private String apiKey;

    @Value("${app.resend.from-email:onboarding@resend.dev}")
    private String fromEmail;

    public ResendMailServiceImpl(TemplateEngine templateEngine) {
        this.templateEngine = templateEngine;
        this.restClient = RestClient.builder()
                .baseUrl("https://api.resend.com")
                .build();
    }

    @Override
    @Async
    public void sendWithTemplate(String to, String subject, String templateName, Map<String, Object> variables) {
        try {
            Context context = new Context();
            if (variables != null) {
                variables.forEach(context::setVariable);
            }
            String htmlContent = templateEngine.process(templateName, context);

            Map<String, Object> payload = Map.of(
                    "from", fromEmail,
                    "to", List.of(to),
                    "subject", subject,
                    "html", htmlContent
            );

            restClient.post()
                    .uri("/emails")
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Content-Type", "application/json")
                    .body(payload)
                    .retrieve()
                    .toBodilessEntity();

            log.info("[Resend] Email có template đã gửi thành công tới: {}", to);
        } catch (Exception e) {
            log.error("[Resend] Lỗi khi gửi email có template tới {}: {}", to, e.getMessage());
            throw new RuntimeException("Gửi email qua Resend thất bại: " + e.getMessage(), e);
        }
    }

    @Override
    @Async
    public void sendSimpleMail(String to, String subject, String content) {
        try {
            Map<String, Object> payload = Map.of(
                    "from", fromEmail,
                    "to", List.of(to),
                    "subject", subject,
                    "text", content
            );

            restClient.post()
                    .uri("/emails")
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Content-Type", "application/json")
                    .body(payload)
                    .retrieve()
                    .toBodilessEntity();

            log.info("[Resend] Email đơn giản đã gửi thành công tới: {}", to);
        } catch (Exception e) {
            log.error("[Resend] Lỗi khi gửi email đơn giản tới {}: {}", to, e.getMessage());
            throw new RuntimeException("Gửi email qua Resend thất bại: " + e.getMessage(), e);
        }
    }
}
