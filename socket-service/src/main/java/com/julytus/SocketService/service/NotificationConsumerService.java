package com.julytus.SocketService.service;

import com.julytus.event.dto.NotificationEvent;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;


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
    public void consume(NotificationEvent notificationEvent) {
        try {
            log.info("Received notification: {}", notificationEvent);
            // Gửi notification tới specific user
            String destination = "/user/" + notificationEvent.getReceiverId() + "/notifications";
            messagingTemplate.convertAndSend(destination, notificationEvent);
            
        } catch (Exception e) {
            log.error("User ID: {}", notificationEvent.getReceiverId());
            log.error("Error message: {}", e.getMessage());
        }
    }
} 