package com.julytus.PostService.mappers;

import com.julytus.PostService.models.dto.request.CommentRequest;
import com.julytus.PostService.models.dto.response.CommentResponse;
import com.julytus.PostService.models.entity.Comment;
import com.julytus.PostService.models.entity.Post;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;

@Component
@RequiredArgsConstructor
public class CommentMapper {
    
    public Comment toComment(CommentRequest request, Post post, Comment parentComment) {
        return Comment.builder()
                .content(request.getContent())
                .post(post)
                .parentComment(parentComment)
                .replyIds(new ArrayList<>())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    public CommentResponse toCommentResponse(Comment comment) {
        return CommentResponse.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .userId(comment.getUserId())
                .postId(comment.getPost().getId())
                .parentCommentId(comment.getParentComment() != null ? 
                        comment.getParentComment().getId() : null)
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .replies(new ArrayList<>()) // replies sẽ được set sau
                .build();
    }
}
