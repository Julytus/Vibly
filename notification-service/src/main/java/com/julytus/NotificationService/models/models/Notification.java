package com.julytus.NotificationService.models.models;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.julytus.event.dto.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Notification {
    @MongoId
    private String id;

    @JsonProperty("sender_id")
    private String senderId;

    @JsonProperty("sender_name")
    private String senderName;

    @JsonProperty("conversation_id")
    private String conversationId;

    @Indexed
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