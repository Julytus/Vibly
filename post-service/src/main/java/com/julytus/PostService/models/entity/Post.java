package com.julytus.PostService.models.entity;

import com.julytus.PostService.constants.PrivacyLevel;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@Document(value = "post")
@FieldDefaults(level = AccessLevel.PRIVATE)
@AllArgsConstructor
@NoArgsConstructor
public class Post {
    @MongoId
    String id;
    String userId;
    String content;
    List<String> imageUrls;
    List<Tag> tags;
    @Builder.Default
    PrivacyLevel privacyLevel = PrivacyLevel.PUBLIC;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
