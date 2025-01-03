package com.julytus.Timeline.dto;

import java.time.LocalDateTime;
import java.util.List;

public record PostResponse(
    String id,
    String userId,
    String content,
    List<String> images,
    LocalDateTime createdAt
) {
    // Constructor với validation
    public PostResponse {
        if (images == null) {
            images = List.of(); // Empty immutable list
        }
    }
} 