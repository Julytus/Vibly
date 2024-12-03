package com.julytus.event.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Notification {
    private String id;

    @JsonProperty("sender_id")
    private String senderId;

    @JsonProperty("conversation_id")
    private String conversationId;

    @JsonProperty("receiver_id")
    private String receiverId;
    
    private String type; // MESSAGE, POST, COMMENT, etc.
    
    private String content;
    
    @JsonProperty("reference_id") 
    private String referenceId; // ID của message/post/comment
    
    @JsonProperty("created_at")
    private LocalDateTime createdAt;
} 