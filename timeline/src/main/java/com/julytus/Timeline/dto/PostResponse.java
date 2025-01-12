package com.julytus.Timeline.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PostResponse {
    private String id;
    private String userId;
    private String avatar;
    @JsonProperty("first_name")
    private String firstName;
    @JsonProperty("last_name")
    private String lastName;
    private String content;
    @JsonProperty("image_urls")
    private List<String> images;
    @JsonProperty("created_at")
    private LocalDateTime createdAt;

    public PostResponse(
            String id,
            String userId,
            String avatar,
            String firstName,
            String lastName,
            String content,
            List<String> images,
            LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.avatar = avatar;
        this.firstName = firstName;
        this.lastName = lastName;
        this.content = content;
        this.images = images != null ? images : List.of();
        this.createdAt = createdAt;
    }

    public PostResponse() {
        this.images = List.of();
    }
} 