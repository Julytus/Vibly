package com.julytus.ChatService.models.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Getter
public class MessageRequest {
    @NotNull(message = "senderId is null!")
    @JsonProperty("sender_id")
    String senderId;

    String content;

    @NotNull(message = "conversationId is null!")
    @JsonProperty("conversation_id")
    String conversationId;
}
