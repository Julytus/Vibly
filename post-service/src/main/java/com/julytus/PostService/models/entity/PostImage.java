package com.julytus.PostService.models.entity;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@Document(value = "post_image")
@FieldDefaults(level = AccessLevel.PRIVATE)
@AllArgsConstructor
@NoArgsConstructor
public class PostImage {
    @MongoId
    String imageId;
    String postId;
    String url;
    LocalDateTime createdAt;
}
