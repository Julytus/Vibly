package com.julytus.profileService.models.dto.request;


import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Getter
@AllArgsConstructor
public class ConversationRequest {
    @NotNull(message = "senderId is null!")
    @JsonProperty("sender_id")
    String senderId;

    @NotNull(message = "senderId is null!")
    @JsonProperty("receiver_id")
    String receiverId;

    String token;
}
