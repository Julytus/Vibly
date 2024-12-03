package com.julytus.SocketService.service;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.julytus.SocketService.model.Message;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class ChatConsumerService {

    private final SimpMessagingTemplate messagingTemplate;

    @KafkaListener(topics = "chat-messages", groupId = "${spring.kafka.consumer.chat-group-id}")
    public void consume(Message message) {
        try {
            String destination = "/conversation/" + message.getConversationId();
            messagingTemplate.convertAndSend(destination, message);

        } catch (Exception e) {
            log.error("Conversation ID: {}", message.getConversationId());
            log.error("Error message: {}", e.getMessage());
        }
    }
} 