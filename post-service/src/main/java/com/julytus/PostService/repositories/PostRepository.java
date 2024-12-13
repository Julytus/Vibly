package com.julytus.PostService.repositories;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.julytus.PostService.constants.PrivacyLevel;
import com.julytus.PostService.models.entity.Post;

@Repository
public interface PostRepository extends MongoRepository<Post, String> {
    Page<Post> findAllByUserId(String userId, Pageable pageable);
    
    @Query("{'userId': ?0, 'privacyLevel': {'$in': ?1}}")
    Page<Post> findByUserIdAndPrivacyLevelIn(String userId, List<PrivacyLevel> privacyLevels, Pageable pageable);
    
    Page<Post> findByTagsHashtag(String hashtag, Pageable pageable);
}
