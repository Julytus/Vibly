package com.julytus.PostService.services;

import com.julytus.PostService.exceptions.DataNotFoundException;
import com.julytus.PostService.mappers.CommentMapper;
import com.julytus.PostService.models.dto.request.CommentRequest;
import com.julytus.PostService.models.dto.response.CommentResponse;
import com.julytus.PostService.models.dto.response.PageResponse;
import com.julytus.PostService.models.entity.Comment;
import com.julytus.PostService.models.entity.Post;
import com.julytus.PostService.repositories.CommentRepository;
import com.julytus.PostService.repositories.HttpClient.NotificationClient;
import com.julytus.PostService.repositories.PostRepository;
import com.julytus.PostService.utils.SecurityUtil;
import com.julytus.event.dto.NotificationEvent;
import com.julytus.event.dto.NotificationType;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CommentService {
    CommentRepository commentRepository;
    PostRepository postRepository;
    CommentMapper commentMapper;
    NotificationClient notificationClient;
    KafkaTemplate<String, Object> kafkaTemplate;


    public PageResponse<CommentResponse> getCommentByPostId(String postId, int page, int size) {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
        Pageable pageable = PageRequest.of(page - 1, size, sort);

        Page<Comment> parentComments = commentRepository.findCommentByPostIdAndParentCommentIsNull(postId, pageable);

        List<CommentResponse> responses = parentComments.getContent()
                .stream()
                .map(comment -> {
                    CommentResponse response = commentMapper.toCommentResponse(comment);
                    
                    if (comment.getReplyIds() != null && !comment.getReplyIds().isEmpty()) {
                        List<Comment> replies = commentRepository.findAllById(comment.getReplyIds());
                        List<CommentResponse> replyResponses = replies.stream()
                                .map(commentMapper::toCommentResponse)
                                .toList();
                        response.setReplies(replyResponses);
                    } else {
                        response.setReplies(new ArrayList<>());
                    }
                    
                    return response;
                })
                .toList();

        return PageResponse.<CommentResponse>builder()
                .currentPage(page)
                .pageSize(pageable.getPageSize())
                .totalElements(parentComments.getTotalElements())
                .totalPages(parentComments.getTotalPages())
                .data(responses)
                .build();
    }

    @PreAuthorize("isAuthenticated()")
    public CommentResponse addComment(CommentRequest request) throws DataNotFoundException {
        String userId = SecurityUtil.getCurrentUserId();

        Post post = postRepository.findById(request.getPostId())
                .orElseThrow(() -> new DataNotFoundException("POST_ID_INVALID"));

        Comment parentComment = null;
        if(request.getParentCommentId() != null) {
            parentComment = commentRepository.findById(request.getParentCommentId())
                    .orElseThrow(() -> new DataNotFoundException("PARENT_COMMENT_NOT_EXISTED"));
        }

        if ((request.getContent() == null || request.getContent().isEmpty())) {
            throw new DataNotFoundException("CONTENT_COMMENT_INVALID");
        }

        Comment comment = commentMapper.toComment(request, post, parentComment);
        comment.setUserId(userId);
        
        Comment savedComment = commentRepository.save(comment);

        if(!savedComment.getUserId().equals(savedComment.getPost().getUserId())) {
            NotificationEvent newNotification = NotificationEvent
                    .builder()
                    .id(savedComment.getId())
                    .referenceId(savedComment.getId())
                    .senderId(savedComment.getUserId())
                    .senderName(request.getFirstName() + " " + request.getLastName())
                    .img(request.getAvatar())
                    .receiverId(savedComment.getPost().getUserId())
                    .type(NotificationType.COMMENT)
                    .content(savedComment.getContent())
                    .createdAt(savedComment.getCreatedAt())
                    .build();
            notificationClient.createNotification(newNotification);

            kafkaTemplate.send("notifications", newNotification);
        }

        if (parentComment != null) {
            parentComment.getReplyIds().add(savedComment.getId());
            commentRepository.save(parentComment);
        }

        return commentMapper.toCommentResponse(savedComment);
    }

    @PreAuthorize("isAuthenticated()")
    public void deleteComment(String commentId) throws Exception {

        String userId = SecurityUtil.getCurrentUserId();

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new DataNotFoundException("COMMENT_NOT_EXISTED"));

        if (Objects.equals(userId, comment.getUserId())) {
            commentRepository.delete(comment);
            return;
        }

        throw new Exception("DELETE_COMMENT_INVALID");
    }
}
