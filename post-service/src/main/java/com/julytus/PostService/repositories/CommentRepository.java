package com.julytus.PostService.repositories;

import com.julytus.PostService.models.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentRepository extends MongoRepository<Comment, String> {
    // Tìm tất cả comment gốc (không có parent) của một post
    @Query("{ 'post.$id' : ?0, 'parentComment' : null }")
    Page<Comment> findCommentByPostIdAndParentCommentIsNull(String postId, Pageable pageable);
}
