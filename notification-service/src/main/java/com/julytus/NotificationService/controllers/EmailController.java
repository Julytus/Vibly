package com.julytus.NotificationService.controllers;

import com.julytus.NotificationService.models.dto.request.SendEmailRequest;
import com.julytus.NotificationService.models.dto.response.EmailResponse;
import com.julytus.NotificationService.services.EmailService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Slf4j
public class EmailController {
    private final EmailService emailService;

    @PostMapping("/email/send")
    public ResponseEntity<EmailResponse> sendEmail(
            @RequestBody SendEmailRequest request) throws Exception {
        return ResponseEntity.ok(emailService.sendEmail(request));
    }
}
