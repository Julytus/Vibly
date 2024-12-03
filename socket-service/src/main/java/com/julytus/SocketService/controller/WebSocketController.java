package com.julytus.SocketService.controller;

import com.julytus.SocketService.model.UserConnectMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.messaging.handler.annotation.SendTo;

import com.julytus.SocketService.model.Message;
import com.julytus.SocketService.listener.WebSocketEventListener;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.Set;

@Controller
@Slf4j
@RequiredArgsConstructor
public class WebSocketController {

    private final WebSocketEventListener webSocketEventListener;

    @MessageMapping("/chat")
    public void processMessage(@Payload Message message, SimpMessageHeaderAccessor headerAccessor) {
        log.info("WebSocket Session ID: {}", headerAccessor.getSessionId());
        log.info("New connection for conversation: {}", message.getConversationId());
    }

    @MessageMapping("/subscribe-notifications")
    public void subscribeNotifications(@Payload Message message, SimpMessageHeaderAccessor headerAccessor) {
        log.info("WebSocket Session ID: {}", headerAccessor.getSessionId());
        log.info("New notification subscription for user: {}", message.getSenderId());
    }

    @MessageMapping("/user.connect")
    public void userConnect(@Payload UserConnectMessage message) {
        log.info("User connected: {}", message.getUserId());
    }

    @MessageMapping("/user.disconnect")
    public void userDisconnect(@Payload UserConnectMessage message) {
        log.info("User disconnected: {}", message.getUserId());
    }

    @MessageMapping("/active-users")
    @SendTo("/topic/active-users")
    public Set<String> getActiveUsers() {
        return WebSocketEventListener.getActiveUsers();
    }
}