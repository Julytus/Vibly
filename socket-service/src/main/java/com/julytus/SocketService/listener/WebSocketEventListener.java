package com.julytus.SocketService.listener;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import lombok.Getter;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
@RequiredArgsConstructor
public class WebSocketEventListener {

    private final SimpMessageSendingOperations messagingTemplate;
    @Getter
    private static final Set<String> activeUsers = ConcurrentHashMap.newKeySet();
    private static final Map<String, String> sessionUserMap = new ConcurrentHashMap<>();

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectEvent event) {
        SimpMessageHeaderAccessor headers = SimpMessageHeaderAccessor.wrap(event.getMessage());
        String sessionId = headers.getSessionId();
        String userId = headers.getFirstNativeHeader("userId");
        
        if (userId != null && sessionId != null) {
            log.info("User Connected - Session ID: {}, User ID: {}", sessionId, userId);
            sessionUserMap.put(sessionId, userId);
            activeUsers.add(userId);
            broadcastActiveUsers();
        }
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        String sessionId = event.getSessionId();
        String userId = sessionUserMap.remove(sessionId);
        
        if (userId != null) {
            log.info("User Disconnected - Session ID: {}, User ID: {}", sessionId, userId);
            
            // Kiểm tra xem user còn session nào khác không
            boolean hasOtherSessions = sessionUserMap.containsValue(userId);
            
            if (!hasOtherSessions) {
                activeUsers.remove(userId);
                broadcastActiveUsers();
                log.info("User {} removed from active users", userId);
            }
        }
    }

    @EventListener
    public void handleWebSocketSubscribeListener(SessionSubscribeEvent event) {
        SimpMessageHeaderAccessor headers = SimpMessageHeaderAccessor.wrap(event.getMessage());
        String sessionId = headers.getSessionId();
        String destination = headers.getDestination();
        
        log.info("New subscription - Session ID: {}, Destination: {}", sessionId, destination);
    }

    private void broadcastActiveUsers() {
        messagingTemplate.convertAndSend("/topic/active-users", activeUsers);
        log.info("Broadcasting active users: {}", activeUsers);
    }

}