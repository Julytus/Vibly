package com.julytus.PostService.models.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CommentResponse {
    String id;
    String content;
    String userId;
    String postId;
    String parentCommentId;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    List<CommentResponse> replies;
}
