package com.julytus.SocketService.service;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.julytus.event.dto.Notification;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class NotificationConsumerService {
    private final SimpMessagingTemplate messagingTemplate;

    @KafkaListener(
        topics = "notifications", 
        groupId = "${spring.kafka.consumer.notification-group-id}",
        containerFactory = "notificationKafkaListenerContainerFactory"
    )
    public void consume(Notification notification) {
        try {
            log.info("Received notification: {}", notification);
            // Gửi notification tới specific user
            String destination = "/user/" + notification.getReceiverId() + "/notifications";
            messagingTemplate.convertAndSend(destination, notification);
            
        } catch (Exception e) {
            log.error("User ID: {}", notification.getReceiverId());
            log.error("Error message: {}", e.getMessage());
        }
    }
} 