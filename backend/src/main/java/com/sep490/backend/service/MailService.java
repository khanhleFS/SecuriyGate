package com.sep490.backend.service;

import java.util.Map;

public interface MailService {
    void sendWithTemplate(String to, String subject, String templateName, Map<String, Object> variables);
    void sendSimpleMail(String to, String subject, String content);
}
