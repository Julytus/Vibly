package com.julytus.PostService.models.entity;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Builder
@Document(value = "comments")
@FieldDefaults(level = AccessLevel.PRIVATE)
@AllArgsConstructor
@NoArgsConstructor
public class Comment {
    @MongoId
    String id;

    String content;

    String userId;

    @DBRef(lazy = true)
    Post post;

    @DBRef(lazy = true)
    Comment parentComment;

    List<String> replyIds = new ArrayList<>();
    
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
