package com.julytus.NotificationService.services;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;

import com.julytus.NotificationService.models.Sender;
import com.julytus.NotificationService.models.dto.request.EmailRequest;
import com.julytus.NotificationService.models.dto.request.SendEmailRequest;
import com.julytus.NotificationService.models.dto.response.EmailResponse;
import com.julytus.NotificationService.repositories.httpclient.EmailClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;

import feign.FeignException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.springframework.util.FileCopyUtils;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EmailService {
    EmailClient emailClient;
    ApplicationContext applicationContext;

    @Value("${notification.email.apikey}")
    @NonFinal
    String apiKey;

    public EmailResponse sendEmail(SendEmailRequest request) throws Exception {
        String htmlContent = loadEmailTemplate("welcome-email.html");
        String personalizedHtmlContent = personalizeContent(htmlContent, request.getTo().getName());

        EmailRequest emailRequest = EmailRequest.builder()
                .sender(Sender.builder()
                        .name("Vibly")
                        .email("chujulytus@gmail.com")
                        .build())
                .to(List.of(request.getTo()))
                .subject(request.getSubject())
                .htmlContent(personalizedHtmlContent)
                .build();
        try {
            return emailClient.sendEmail(apiKey, emailRequest);
        } catch (FeignException e) {
            throw new Exception("Cannot send email");
        }
    }
    private String loadEmailTemplate(String templateName) throws Exception {
        try {
            Resource resource = applicationContext.getResource("classpath:templates/email/" + templateName);
            byte[] byteArray = FileCopyUtils.copyToByteArray(resource.getInputStream());
            return new String(byteArray, StandardCharsets.UTF_8);
        } catch (IOException e) {
            throw new Exception("EMAIL_TEMPLATE_NOT_FOUND");
        }
    }

    private String personalizeContent(String htmlContent, String recipientName) {
        return htmlContent.replace("{{recipientName}}", recipientName);
    }
}
