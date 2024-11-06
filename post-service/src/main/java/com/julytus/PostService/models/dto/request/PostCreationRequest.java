package com.julytus.PostService.models.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PostCreationRequest {
    @NotNull(message = "user ID is null!")
    String userId;
    String content;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
