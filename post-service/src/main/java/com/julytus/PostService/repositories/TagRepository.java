package com.julytus.PostService.repositories;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.julytus.PostService.models.entity.Tag;

public interface TagRepository extends MongoRepository<Tag, String> {
    Optional<Tag> findByName(String name);
    Optional<Tag> findByHashtag(String hashTag);
} 