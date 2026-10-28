package com.sep490.backend.common.mail;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Map;

/**
 * Helper đóng gói toàn bộ logic khởi tạo biến template và gửi email OTP.
 * Giúp các Service loại bỏ hoàn toàn boilerplate code và cảnh báo SonarLint.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class OtpMailHelper {

    private static final String OTP_TEMPLATE = "email/otp-email";
    private static final int DEFAULT_EXPIRY_MINUTES = 5;

    private final MailService mailService;

    public void sendOtpMail(String toEmail, String fullName, String otpCode, OtpEmailType type) {
        String recipientName = (fullName != null && !fullName.isBlank()) ? fullName : "Quý khách";

        Map<String, Object> variables = Map.of(
            "fullName", recipientName,
            "otpCode", otpCode,
            "actionTitle", type.getActionTitle(),
            "actionMessage", type.getActionMessage(),
            "expiryMinutes", DEFAULT_EXPIRY_MINUTES
        );

        mailService.sendWithTemplate(toEmail, type.getSubject(), OTP_TEMPLATE, variables);
    }
}
