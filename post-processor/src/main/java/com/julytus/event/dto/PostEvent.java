package com.julytus.event.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class PostEvent {
    private String id;
    private String userId;
    private String content;
    private List<String> imageUrls;
    private LocalDateTime createdAt;
} 