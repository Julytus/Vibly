package com.julytus.PostService.services;

import com.julytus.PostService.exceptions.DataNotFoundException;
import com.julytus.PostService.models.dto.request.LikeRequest;
import com.julytus.PostService.models.dto.response.PageResponse;
import com.julytus.PostService.models.entity.Comment;
import com.julytus.PostService.models.entity.Like;
import com.julytus.PostService.models.entity.Post;
import com.julytus.PostService.repositories.CommentRepository;
import com.julytus.PostService.repositories.HttpClient.NotificationClient;
import com.julytus.PostService.repositories.LikeRepository;
import com.julytus.PostService.repositories.PostRepository;
import com.julytus.PostService.utils.SecurityUtil;
import com.julytus.event.dto.NotificationEvent;
import com.julytus.event.dto.NotificationType;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class LikeService {
    private final LikeRepository likeRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final NotificationClient notificationClient;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    @PreAuthorize("isAuthenticated()")
    @Transactional
    public void likePost(LikeRequest request) throws DataNotFoundException {
        String userId = SecurityUtil.getCurrentUserId();
        
        Post post = postRepository.findById(request.getPostId())
                .orElseThrow(() -> new DataNotFoundException("POST_NOT_FOUND"));

        if (!likeRepository.existsByUserIdAndPostId(userId, request.getPostId())) {
            Like like = Like.builder()
                    .userId(userId)
                    .firstName(request.getFirstName())
                    .lastName(request.getLastName())
                    .avatar(request.getAvatar())
                    .post(post)
                    .createdAt(LocalDateTime.now())
                    .build();
            likeRepository.save(like);

            if(!like.getUserId().equals(like.getPost().getUserId())) {
                NotificationEvent newNotification = NotificationEvent
                        .builder()
                        .id(like.getId())
                        .referenceId(like.getId())
                        .senderId(like.getUserId())
                        .senderName(like.getFirstName()
                                + " " + like.getLastName())
                        .img(request.getAvatar())
                        .receiverId(like.getPost().getUserId())
                        .type(NotificationType.REACTION)
                        .createdAt(like.getCreatedAt())
                        .build();
                notificationClient.createNotification(newNotification);

                kafkaTemplate.send("notifications", newNotification);
            }
        }
    }

    @PreAuthorize("isAuthenticated()")
    @Transactional
    public void unlikePost(String postId) throws DataNotFoundException {
        String userId = SecurityUtil.getCurrentUserId();
        
        if (!postRepository.existsById(postId)) {
            throw new DataNotFoundException("POST_NOT_FOUND");
        }

        likeRepository.deleteByUserIdAndPostId(userId, postId);
    }

    public PageResponse<Like> getPostLikers(String postId, int page, int size) throws DataNotFoundException {
        if (!postRepository.existsById(postId)) {
            throw new DataNotFoundException("POST_NOT_FOUND");
        }

        Sort sort = Sort.by("createdAt").descending();
        Pageable pageable = PageRequest.of(page - 1, size, sort);
        Page<Like> likes = likeRepository.findByPostId(postId, pageable);

        return PageResponse.<Like>builder()
                .currentPage(page)
                .pageSize(pageable.getPageSize())
                .totalElements(likes.getTotalElements())
                .totalPages(likes.getTotalPages())
                .data(likes.getContent())
                .build();
    }

    @PreAuthorize("isAuthenticated()")
    @Transactional
    public void likeComment(LikeRequest request) throws DataNotFoundException {
        String userId = SecurityUtil.getCurrentUserId();

        Comment comment = commentRepository.findById(request.getPostId())
                .orElseThrow(() -> new DataNotFoundException("COMMENT_NOT_FOUND"));

        if (likeRepository.existsByUserIdAndPostId(userId, request.getPostId())) {
            Like like = Like.builder()
                    .userId(userId)
                    .firstName(request.getFirstName())
                    .lastName(request.getLastName())
                    .avatar(request.getAvatar())
                    .comment(comment)
                    .createdAt(LocalDateTime.now())
                    .build();
            likeRepository.save(like);
        }
    }

    @PreAuthorize("isAuthenticated()")
    @Transactional
    public void unlikeComment(String commentId) throws DataNotFoundException {
        String userId = SecurityUtil.getCurrentUserId();

        if (!commentRepository.existsById(commentId)) {
            throw new DataNotFoundException("COMMENT_NOT_FOUND");
        }

        likeRepository.deleteByUserIdAndCommentId(userId, commentId);
    }

    public PageResponse<Like> getCommentLikers(String commentId, int page, int size) throws DataNotFoundException {
        if (!commentRepository.existsById(commentId)) {
            throw new DataNotFoundException("COMMENT_NOT_FOUND");
        }

        Sort sort = Sort.by("createdAt").descending();
        Pageable pageable = PageRequest.of(page - 1, size, sort);
        Page<Like> likes = likeRepository.findByCommentId(commentId, pageable);

        return PageResponse.<Like>builder()
                .currentPage(page)
                .pageSize(pageable.getPageSize())
                .totalElements(likes.getTotalElements())
                .totalPages(likes.getTotalPages())
                .data(likes.getContent())
                .build();
    }
} 