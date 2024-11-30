package com.julytus.SocketService.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

import com.julytus.SocketService.model.Message;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
@RequiredArgsConstructor
public class WebSocketController {

    @MessageMapping("/chat")
    public void processMessage(@Payload Message message, SimpMessageHeaderAccessor headerAccessor) {
        log.info("WebSocket Session ID: {}", headerAccessor.getSessionId());
        log.info("New connection for conversation: {}", message.getConversationId());
    }
} 