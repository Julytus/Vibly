package com.julytus.PostService.repositories;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.julytus.PostService.models.entity.Like;

@Repository
public interface LikeRepository extends MongoRepository<Like, String> {
    Optional<Like> findByUserIdAndPostId(String userId, String postId);
    Page<Like> findByPostId(String postId, Pageable pageable);
    Page<Like> findByCommentId(String commentId, Pageable pageable);
    boolean existsByUserIdAndPostId(String userId, String postId);
    void deleteByUserIdAndPostId(String userId, String postId);
    void deleteByUserIdAndCommentId(String userId, String commentId);
} 