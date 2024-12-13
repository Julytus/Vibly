package com.julytus.NotificationService.controllers;

import com.julytus.event.dto.SendEmailEvent;
import com.julytus.NotificationService.models.WelcomeEmail.Recipient;
import com.julytus.NotificationService.models.dto.request.SendEmailRequest;
import com.julytus.NotificationService.services.EmailService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EmailListener {

    EmailService emailService;

    @KafkaListener(topics = "vibly-notification-email")
    public void listenNotificationDelivery(
            SendEmailEvent message) throws Exception {
        log.info("Message received: {}", message);
        emailService.sendEmail(SendEmailRequest.builder()
                .to(Recipient
                        .builder()
                        .email(message.getRecipient())
                        .name(message.getRecipientName())
                        .build())
                .subject(message.getSubject())
                .htmlContent(message.getBody())
                .build());
    }
}
