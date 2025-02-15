package com.julytus.event.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
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
@JsonInclude(JsonInclude.Include.NON_NULL)
public class NotificationEvent {
    private String id;

    @JsonProperty("sender_id")
    private String senderId;

    @JsonProperty("sender_name")
    private String senderName;

    @JsonProperty("sender_avatar")
    private String senderAvatar;

    @JsonProperty("conversation_id")
    private String conversationId;

    @JsonProperty("receiver_id")
    private String receiverId;

    @JsonProperty("receiver_name")
    private String receiverName;

    private NotificationType type; // MESSAGE, POST, COMMENT, etc.

    private String content;

    @JsonProperty("reference_id")
    private String referenceId; // ID của message/post/comment

    @JsonProperty("created_at")
    private LocalDateTime createdAt;

    private String img;
}